import { AnchorProvider, Wallet } from '@heavy-duty/anchor';
import {
    bundlrStorage,
    keypairIdentity,
    Metaplex
} from '@metaplex-foundation/js';
import { createVerifyCollectionInstruction } from '@metaplex-foundation/mpl-token-metadata';
import {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    Transaction
} from '@solana/web3.js';
import * as dotenv from 'dotenv';
import { Event } from './utils';
import { getArtists, getNftDescription, getSponsors } from './utils/utils';

dotenv.config();

const main = async (event: Event) => {
    if (process.env.PAYER_PRIVATE_KEY === undefined) {
        throw new Error('Payer private key missing.');
    }

    const description = getNftDescription();
    const keypair = Keypair.fromSecretKey(
        new Uint8Array(Buffer.from(process.env.PAYER_PRIVATE_KEY, 'base64'))
    );
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const provider = new AnchorProvider(
        connection,
        new Wallet(keypair),
        AnchorProvider.defaultOptions()
    );
    const metaplex = new Metaplex(connection).use(keypairIdentity(keypair)).use(
        bundlrStorage({
            address: 'https://devnet.bundlr.network',
            providerUrl: 'https://api.devnet.solana.com',
            timeout: 60000,
        })
    );

    const name = 'Bogotá Party';

    const { uri } = await metaplex.nfts().uploadMetadata({
        name,
        description,
        image: event.image,
        external_url: event.website,
        symbol: 'DEV',
        attributes: [
            {
                trait_type: 'Location',
                value: 'Bogotá, Colombia',
            },
            {
                trait_type: 'Date',
                value: 'OCT 25 2022',
            },
            {
                trait_type: 'Made By',
                value: 'Heavy Duty Builders',
            },
            {
                trait_type: 'Powered By',
                value: 'Solana University',
            },
        ],
    });

    const { nft: collectionNft } = await metaplex.nfts().create({
        name,
        sellerFeeBasisPoints: 0,
        uri,
        isCollection: true,
        collectionAuthority: keypair,
        tokenOwner: provider.wallet.publicKey
    });

    for (const ticket of event.tickets) {
        const { uri } = await metaplex.nfts().uploadMetadata({
            name,
            description,
            image: event.image,
            external_url: event.website,
            symbol: 'EVENT',
            attributes: [
                {
                    trait_type: 'Ticket #',
                    value: `${ticket.number}`,
                },
                {
                    trait_type: 'Date',
                    value: event.date,
                },
                {
                    trait_type: 'Location',
                    value: event.location,
                },
                {
                    trait_type: 'Genre',
                    value: event.genre,
                },
                ...getArtists(event.artists),
                ...getSponsors(event.sponsors),
            ],
        });

        const { nft } = await metaplex.nfts().create({
            name,
            sellerFeeBasisPoints: 0,
            uri,
            collection: collectionNft.mint.address,
            tokenOwner: new PublicKey(ticket.wallet),
        });

        // Add the NFT to the user's wallet
        await provider.sendAndConfirm(
            new Transaction().add(
                createVerifyCollectionInstruction({
                    collectionMint: collectionNft.mint.address,
                    collection: collectionNft.metadataAddress,
                    collectionAuthority: provider.wallet.publicKey,
                    collectionMasterEditionAccount: collectionNft.address,
                    metadata: nft.metadataAddress,
                    payer: provider.wallet.publicKey,
                })
            )
        );
    }
};

const event = {
    date: 'NOV 4 2022',
    location: 'Bogotá, Colombia',
    genre: 'Rock',
    artists: ['The Rolling Stones', 'The Beatles'],
    sponsors: ['Heavy Duty Builders', 'Solana University'],
    website: 'https://heavyduty.builders',
    image: 'http://as01.epimg.net/img/comunes/fotos/fichas/equipos/large/3.png',
    tickets: [
        {
            number: 1,
            wallet: '75g5AdQBi4QZg53wQMdX4nvPQCWdUJ9dtV4keBS2RKmP',
        },
        /* {
            number: 2,
            wallet: '75g5AdQBi4QZg53wQMdX4nvPQCWdUJ9dtV4keBS2RKmP',
        },
        {
            number: 3,
            wallet: '75g5AdQBi4QZg53wQMdX4nvPQCWdUJ9dtV4keBS2RKmP',
        }, */
    ],
};

main(event)
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log(error);
    });

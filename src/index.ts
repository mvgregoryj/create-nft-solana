/* eslint-disable indent */
import { AnchorProvider, Wallet } from '@heavy-duty/anchor';
import {
    bundlrStorage,
    keypairIdentity,
    Metaplex,
} from '@metaplex-foundation/js';
import { createSetAndVerifyCollectionInstruction } from '@metaplex-foundation/mpl-token-metadata';
import {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    Transaction,
} from '@solana/web3.js';

// import getNftDescription from utils.ts
import {
    getNftDescription,
    getArtists,
    getSponsors
} from './utils/utils';


const main = async (data: any) => {

    const description = getNftDescription();
    const keypair = Keypair.generate();                     // Replace with Heavy-Duty-keypair

    const connection = new Connection(clusterApiUrl('devnet'));

    // AirDrop SOL to the keypair
    // 1e9 lamports = 10^9 lamports = 1 SOL
    let txhash = await connection.requestAirdrop(keypair.publicKey, 1e9);
    console.log(`txhash: ${txhash}`);

    const provider = new AnchorProvider(
        connection,
        new Wallet(keypair),
        AnchorProvider.defaultOptions(),
    );

    const metaplex = new Metaplex(connection)
        .use(keypairIdentity(keypair))
        .use(bundlrStorage({
            address: 'https://devnet.bundlr.network',
            providerUrl: 'https://api.devnet.solana.com',
            timeout: 60000,
        }));

    try {
        const name = 'Bogotá Party';

        const { uri } = await metaplex.nfts().uploadMetadata({
            name,
            description,
            //image: process.env.COLLECTION_IMAGE_URL,
            image: 'http://as01.epimg.net/img/comunes/fotos/fichas/equipos/large/3.png',
            external_url: 'https://heavyduty.builders',
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

            const { nft:nft_owner } = await metaplex.nfts().create({
                name,
                sellerFeeBasisPoints: 0,
                uri,
            });


        for (const item of data) {

            const { uri } = await metaplex.nfts().uploadMetadata({
                name,
                description,
                //image: process.env.COLLECTION_IMAGE_URL,
                image: 'http://as01.epimg.net/img/comunes/fotos/fichas/equipos/large/3.png',
                external_url: `${item.website}`,
                symbol: 'DEV',
                attributes: [
                    {
                        trait_type: 'Ticket Number',
                        value: `${item.ticket_number}`,
                    },
                    {
                        trait_type: 'Date',
                        value: `${item.date}`,
                    },
                    {
                        trait_type: 'Location',
                        value: `${item.location}`,
                    },
                    {
                        trait_type: 'Genre',
                        value: `${item.genre}`,
                    },
                    ...getArtists(item.artists),
                    ...getSponsors(item.sponsors),
                ],
            });

            const usersVault = new PublicKey(item.wallet);
            const { nft } = await metaplex.nfts().create({
                name,
                sellerFeeBasisPoints: 0,
                uri,
                collection: nft_owner.collection?.address,
                tokenOwner: usersVault,
            });

            // Add the NFT to the user's wallet
            await provider.sendAndConfirm(
                new Transaction().add(
                    createSetAndVerifyCollectionInstruction({
                        collectionMint: nft_owner.mint.address,
                        collection: nft_owner.metadataAddress,
                        collectionAuthority: provider.wallet.publicKey,
                        collectionMasterEditionAccount: nft_owner.address,
                        metadata: nft.metadataAddress,
                        payer: provider.wallet.publicKey,
                        updateAuthority: provider.wallet.publicKey,
                    }),
                ),
            );
        };

    } catch (error) {
        console.log(error)
        return false;
    }

    return true;
};


const data = [
    {
        ticket_number: '1',
        date: 'NOV 4 2022',
        location: 'Bogotá, Colombia',
        genre: 'Rock',
        artists: ['The Rolling Stones', 'The Beatles'],
        sponsors: ['Heavy Duty Builders', 'Solana University'],
        website: 'https://heavyduty.builders',
        wallet: '75g5AdQBi4QZg53wQMdX4nvPQCWdUJ9dtV4keBS2RKmP',
    },
    {
        ticket_number: '2',
        date: 'NOV 4 2022',
        location: 'Bogotá, Colombia',
        genre: 'Pop',
        artists: ['The Rolling Stones', 'The Beatles'],
        sponsors: ['Heavy Duty Builders', 'Solana University'],
        website: 'https://heavyduty.builders',
        wallet: '75g5AdQBi4QZg53wQMdX4nvPQCWdUJ9dtV4keBS2RKmP',
    },
    {
        ticket_number: '3',
        date: 'NOV 4 2022',
        location: 'Bogotá, Colombia',
        genre: 'Dance',
        artists: ['The Rolling Stones', 'The Beatles'],
        sponsors: ['Heavy Duty Builders', 'Solana University'],
        website: 'https://heavyduty.builders',
        wallet: '75g5AdQBi4QZg53wQMdX4nvPQCWdUJ9dtV4keBS2RKmP',
    },
    {
        ticket_number: '4',
        date: 'NOV 4 2022',
        location: 'Bogotá, Colombia',
        genre: 'Rap',
        artists: ['The Rolling Stones', 'The Beatles'],
        sponsors: ['Heavy Duty Builders', 'Solana University'],
        website: 'https://heavyduty.builders',
        wallet: '75g5AdQBi4QZg53wQMdX4nvPQCWdUJ9dtV4keBS2RKmP',
    }
];


main(data)
    .then((result) => {
        console.log(result);
    });


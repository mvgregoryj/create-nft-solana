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


const DRILL_CLAIM_LABEL = 'claim';

const main = async (data) => {

    const description = getNftDescription();
    const keypair = Keypair.fromSecretKey(
        new Uint8Array(Buffer.from(process.env.CERTIFIER_SECRET, 'base64')),
    );
    const connection = new Connection(clusterApiUrl('mainnet-beta'));
    const provider = new AnchorProvider(
        connection,
        new Wallet(keypair),
        AnchorProvider.defaultOptions(),
    );

    const metaplex = new Metaplex(connection)
        .use(keypairIdentity(keypair))
        .use(bundlrStorage());

    try {
        const name = 'Bogotá Party';

        const { uri } = await metaplex.nfts().uploadMetadata({
            name,
            description,
            image: process.env.COLLECTION_IMAGE_URL,
            external_url: 'https://heavyduty.builders',
            symbol: 'DEV',
            attributes: [
                {
                    trait_type: 'Location',
                    value: 'Bogotá, Colombia',
                },
                {
                    trait_type: 'Date',
                    value: 'NOV 4-8 2022',
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
                image: process.env.COLLECTION_IMAGE_URL,
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
                        collection: nft_owner.collection?.address,
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

function getArtists(artists: any) {
    const attributes = [];
    for (const artist of artists) {
        attributes.push({
            trait_type: 'Artist',
            value: artist,
        });
    }
    return attributes;
}

function getSponsors(sponsors: any) {
    const attributes = [];
    for (const sponsor of sponsors) {
        attributes.push({
            trait_type: 'Sponsor',
            value: sponsor,
        });
    }
    return attributes;
}


main(data)
    .then((result) => {
        console.log(result);
    });

export default main;

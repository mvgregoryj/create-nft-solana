import { AnchorProvider, Wallet } from '@heavy-duty/anchor';
import {
    bundlrStorage,
    keypairIdentity,
    Metaplex,
} from '@metaplex-foundation/js';
import { createVerifySizedCollectionItemInstruction } from '@metaplex-foundation/mpl-token-metadata';
import {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    Transaction,
} from '@solana/web3.js';
import * as dotenv from 'dotenv';
import { event } from './event-data';
import { Event } from './utils';
import { toAttribute, toAttributes } from './utils/utils';

dotenv.config();

const main = async (event: Event) => {
    if (process.env.PAYER_PRIVATE_KEY === undefined) {
        throw new Error('Payer private key missing.');
    }

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

    if (process.env.LOG_ENABLED === 'true') {
        console.log('minting collection', event.name);
    }

    const { uri: collectionMetadataUri } = await metaplex
        .nfts()
        .uploadMetadata({
            name: event.name,
            description: event.description,
            image: event.image,
            external_url: event.website,
            symbol: 'EVENT',
            attributes: [
                toAttribute('Location')(event.location),
                toAttribute('Date')(event.date),
            ]
                .concat(toAttributes('Artist', event.artists))
                .concat(toAttributes('Sponsor', event.sponsors)),
        });

    const { nft: collectionNft } = await metaplex.nfts().create({
        name: event.name,
        sellerFeeBasisPoints: 0,
        uri: collectionMetadataUri,
        symbol: 'EVENT',
        isCollection: true,
    });

    if (process.env.LOG_ENABLED === 'true') {
        console.log('collection minted', collectionNft.mint.address.toBase58());
    }

    for (const ticket of event.tickets) {
        const ticketName = `Ticket #${ticket.number}: ${event.name}`;

        if (process.env.LOG_ENABLED === 'true') {
            console.log('minting ticket', ticketName);
        }

        const { uri: ticketMetadataUri } = await metaplex
            .nfts()
            .uploadMetadata({
                name: ticketName,
                description: `This NFT represents ticket #${ticket.number} for the ${event.name} event.`,
                image: event.image,
                external_url: event.website,
                symbol: 'EVENT',
                attributes: [
                    toAttribute('Ticket #')(`${ticket.number}`),
                    toAttribute('Location')(event.location),
                    toAttribute('Date')(event.date),
                    toAttribute('Genre')(event.genre),
                ]
                    .concat(toAttributes('Artist', event.artists))
                    .concat(toAttributes('Sponsor', event.sponsors)),
            });

        const { nft: ticketNft } = await metaplex.nfts().create({
            name: ticketName,
            sellerFeeBasisPoints: 0,
            uri: ticketMetadataUri,
            collection: collectionNft.mint.address,
            tokenOwner: new PublicKey(ticket.wallet),
            symbol: 'TICKET',
        });

        // Add the NFT to the user's wallet
        await provider.sendAndConfirm(
            new Transaction().add(
                createVerifySizedCollectionItemInstruction({
                    collectionMint: collectionNft.mint.address,
                    collection: collectionNft.metadataAddress,
                    collectionAuthority: provider.wallet.publicKey,
                    collectionMasterEditionAccount:
                        collectionNft.edition.address,
                    metadata: ticketNft.metadataAddress,
                    payer: provider.wallet.publicKey,
                })
            )
        );

        if (process.env.LOG_ENABLED === 'true') {
            console.log(
                'ticket minted and verified',
                ticketNft.mint.address.toBase58()
            );
        }
    }
};

main(event)
    .then(() => {
        console.log('OK');
    })
    .catch((error) => {
        console.log(error);
    });

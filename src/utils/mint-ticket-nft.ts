import { Metaplex } from '@metaplex-foundation/js';
import { PublicKey } from '@solana/web3.js';
import { Event, Ticket } from './types';
import { toAttribute, attributes} from './utils';

export const mintTicketNft = async (
    metaplex: Metaplex,
    event: Event,
    eventMintAddress: PublicKey,
    ticket: Ticket
) => {
    const ticketName = `Ticket #${ticket.number}: ${event.name}`;

    if (process.env.LOG_ENABLED === 'true') {
        console.log('minting ticket', ticketName);
    }

    const { uri: ticketMetadataUri } = await metaplex.nfts().uploadMetadata({
        name: ticketName,
        description: `This NFT represents ticket #${ticket.number} for the ${event.name} event.`,
        image: event.image,
        external_url: event.website,
        symbol: 'EVENT',
        attributes: [
            toAttribute('Ticket #')(`${ticket.number}`),
        ]
        .concat(attributes(Object.entries(event)))
});

    const { nft: ticketNft } = await metaplex.nfts().create({
        name: ticketName,
        sellerFeeBasisPoints: 0,
        uri: ticketMetadataUri,
        collection: eventMintAddress,
        tokenOwner: new PublicKey(ticket.wallet),
        symbol: 'TICKET',
    });

    if (process.env.LOG_ENABLED === 'true') {
        console.log('ticket minted', ticketNft.mint.address.toBase58());
    }

    return ticketNft;
};

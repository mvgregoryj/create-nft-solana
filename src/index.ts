import * as dotenv from 'dotenv';
import { event } from './event-data';
import {
    Event,
    getConfig,
    mintCollectionNft,
    mintTicketNft,
    verifyTicketNft
} from './utils';

dotenv.config();

const main = async (event: Event) => {
    const { provider, metaplex } = getConfig();
    const collectionNft = await mintCollectionNft(metaplex, event);

    for (const ticket of event.tickets) {
        const ticketNft = await mintTicketNft(
            metaplex,
            event,
            collectionNft.address,
            ticket
        );
        await verifyTicketNft(provider, collectionNft, ticketNft);
    }
};

main(event)
    .then(() => {
        console.log('OK');
    })
    .catch((error) => {
        console.log(error);
    });

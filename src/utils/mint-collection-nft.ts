import { Metaplex } from '@metaplex-foundation/js';
import { Event } from './types';
import { attributes } from './utils';

export const mintCollectionNft = async (metaplex: Metaplex, event: Event) => {
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
            attributes: attributes(Object.entries(event))
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

    return collectionNft;
};

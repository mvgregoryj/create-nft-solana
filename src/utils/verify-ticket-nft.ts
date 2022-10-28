import { AnchorProvider } from '@heavy-duty/anchor';
import { Nft } from '@metaplex-foundation/js';
import { createVerifySizedCollectionItemInstruction } from '@metaplex-foundation/mpl-token-metadata';
import { Transaction } from '@solana/web3.js';

export const verifyTicketNft = async (
    provider: AnchorProvider,
    collectionNft: Nft,
    ticketNft: Nft
) => {
    if (process.env.LOG_ENABLED === 'true') {
        console.log('ticket being verified', ticketNft.mint.address.toBase58());
    }

    // Add the NFT to the user's wallet
    await provider.sendAndConfirm(
        new Transaction().add(
            createVerifySizedCollectionItemInstruction({
                collectionMint: collectionNft.mint.address,
                collection: collectionNft.metadataAddress,
                collectionAuthority: provider.wallet.publicKey,
                collectionMasterEditionAccount: collectionNft.edition.address,
                metadata: ticketNft.metadataAddress,
                payer: provider.wallet.publicKey,
            })
        )
    );

    if (process.env.LOG_ENABLED === 'true') {
        console.log(
            'ticket successfully verified',
            ticketNft.mint.address.toBase58()
        );
    }
};

import { Keypair } from "@solana/web3.js";
import * as bs58 from "bs58";

(async () => {
    {
    // 1. create a random keypair
    const keypair = Keypair.generate();
    const public_key = keypair.publicKey.toBase58();
    const private_key_raw = keypair.secretKey;
    const private_key_bs58 = bs58.encode(keypair.secretKey);

    console.log(`public key: ${public_key}`);
    console.log(`private key(raw): ${private_key_raw}`);
    console.log(`private key(bs58): ${private_key_bs58}`);

    // 2. create keypair from bs58 string
    const keypair_2 = Keypair.fromSecretKey(bs58.decode(private_key_bs58));
    const public_key_2 = keypair_2.publicKey.toBase58();
    const private_key_raw_2 = keypair_2.secretKey;
    const private_key_bs58_2 = bs58.encode(keypair_2.secretKey);

    console.log(`public key: ${public_key_2}`);
    console.log(`private key(raw): ${private_key_raw_2}`);
    console.log(`private key(bs58): ${private_key_bs58_2}`);

    // 3. create keypair from bytes
    const keypair_3 = Keypair.fromSecretKey(Uint8Array.from(private_key_raw));
    const public_key_3 = keypair_3.publicKey.toBase58();
    const private_key_raw_3 = keypair_3.secretKey;
    const private_key_bs58_3 = bs58.encode(keypair_3.secretKey);

    console.log(`public key: ${public_key_3}`);
    console.log(`private key(raw): ${private_key_raw_3}`);
    console.log(`private key(bs58): ${private_key_bs58_3}`);
  }
})();

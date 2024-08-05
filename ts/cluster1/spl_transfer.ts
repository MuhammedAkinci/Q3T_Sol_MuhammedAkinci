import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "./wallet/wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("B5eqzq6TBWp9w2NyGRsUhcCRszGzpFKvxSdhjWnEGdFT");

// Recipient address
const to = new PublicKey("GxZ9FCxucDrBt59oNaR6ptooSPpVN5ssajfVhJtGqjFw");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it

        const ataFrom = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );

        const ataTo = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to,
        );
        // Get the token account of the toWallet address, and if it does not exist, create it
        const tx = await transfer(
            connection,
            keypair,
            ataFrom.address,
            ataTo.address,
            keypair,
            2e6
        );

        console.log(`Your transfer txid: ${tx}`);

        // Transfer the new token to the "toTokenAccount" we just created
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
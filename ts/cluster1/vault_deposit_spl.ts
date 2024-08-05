import {
  Connection,
  Keypair,
  SystemProgram,
  PublicKey,
  Commitment,
} from "@solana/web3.js";
import {
  Program,
  Wallet,
  AnchorProvider,
  Address,
  BN,
} from "@coral-xyz/anchor";
import { WbaVault, IDL } from "../programs/wba_vault";
import wallet from "../wba-wallet.json";
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Commitment
const commitment: Commitment = "finalized";

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment,
});

// Create our program
const program = new Program<WbaVault>(IDL, "<program_address>" as Address, provider); 

// Vault State PublicKey
const vaultState = new PublicKey("<vault_state_address>");

// Create the PDA for our enrollment account
const [vaultAuth] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault_auth"), vaultState.toBuffer()],
  program.programId
);

// Create the vault key
const [vault] = PublicKey.findProgramAddressSync(
  [Buffer.from("vault"), vaultAuth.toBuffer()],
  program.programId
);

// Mint address
const mint = new PublicKey("<mint_address>"); 

// Token decimals
const tokenDecimals = 1_000_000n; 

// Execute our enrollment transaction
(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const ownerAta = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );
    console.log(`Owner ATA: ${ownerAta.address.toBase58()}`);

    // Get the token account of the vault address, and if it does not exist, create it
    const vaultAta = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      vaultAuth
    );
    console.log(`Vault ATA: ${vaultAta.address.toBase58()}`);

    // Deposit SPL tokens into the vault// Örnek değer, yatırılacak token miktarı

    const signature = await program.methods
      .depositSpl(depositAmount)
      .accounts({
        vaultState: vaultState,
        vault: vault,
        vaultAuth: vaultAuth,
        owner: keypair.publicKey,
        ownerAta: ownerAta.address,
        vaultAta: vaultAta.address,
        mint: mint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([keypair])
      .rpc();

    console.log(`Deposit success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();

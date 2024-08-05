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
import { WbaVault, IDL } from "./programs/wba_vault";
import wallet from "./wallet/wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Commitment
const commitment: Commitment = "confirmed";

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

// Create a random keypair for the close vault state
const closeVaultState = Keypair.generate();

(async () => {
  try {
    // Close the vault account
    const signature = await program.methods
      .closeAccount()
      .accounts({
        vaultState: vaultState,
        closeVaultState: closeVaultState.publicKey,
        authority: keypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([keypair, closeVaultState])
      .rpc();
      
    console.log(`Close success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();

const { 
  Connection, 
  Keypair, 
  clusterApiUrl, 
  LAMPORTS_PER_SOL 
} = require('@solana/web3.js');
const { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo 
} = require('@solana/spl-token');

async function createMyToken() {
  // Connect to Devnet
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

  // Generate a new wallet for testing
  const payer = Keypair.generate();

  console.log("Requesting Airdrop...");
  const airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(airdropSignature);

  console.log("Payer Address:", payer.publicKey.toBase58());

  // Create New Token Mint
  const mint = await createMint(
    connection,
    payer,
    payer.publicKey,
    null,
    9 // 9 Decimals
  );

  console.log("Token Mint Created:", mint.toBase58());

  // Create Associated Token Account
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );

  console.log("Token Account Created:", tokenAccount.address.toBase58());

  // Mint 100 Tokens
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer,
    100000000000 // 100 tokens with 9 decimals
  );

  console.log("Success! 100 Tokens minted to your wallet.");
}

createMyToken().catch(console.error);

const anchor = require('@project-serum/anchor')

const testGifLink = "https://i.gifer.com/AlED.gif";

const main = async () => {
  console.log("Starting tests...");

  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const baseAccount = anchor.web3.Keypair.generate()
  const program = anchor.workspace.Gifportal
  const tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [baseAccount]
  });
  console.log("your trx signature: ", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('Gif Count', account.totalGifs.toString());

  await program.rpc.addGif(testGifLink, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })

  await program.rpc.upvote(testGifLink, {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })

  let creatorAcc = anchor.web3.Keypair.generate();

  // let ad0 = await provider.connection.requestAirdrop(provider.wallet.publicKey, 1000000000);
  // console.log('drop: ', ad0);
  
  let ad1 = await provider.connection.requestAirdrop(creatorAcc.publicKey, 1000000000);
  console.log('drop creator: ', ad1);

  console.log('ad', provider.wallet.publicKey.toString());
  console.log('ad creator', creatorAcc.publicKey.toString());

  console.log('bal', await provider.connection.getBalance(provider.wallet.publicKey));
  console.log('bal creator', await provider.connection.getBalance(creatorAcc.publicKey));

  await program.rpc.sendSol(new anchor.BN(2), {
    accounts: {
      from: provider.wallet.publicKey,
      to: creatorAcc.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('Gif Count', account.totalGifs.toString());
  console.log('Gif List', account.gifList);


  console.log('bal', await provider.connection.getBalance(provider.wallet.publicKey));
  console.log('bal creator', await provider.connection.getBalance(creatorAcc.publicKey));

};
const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
};
runMain()
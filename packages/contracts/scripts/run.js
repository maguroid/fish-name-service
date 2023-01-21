const main = async () => {
  const [owner, hacker] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainContractFactory.deploy("fish");
  await domainContract.deployed();

  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract owner:", owner.address);

  let tx = await domainContract.register("maguro", {
    value: hre.ethers.utils.parseEther("1234"),
  });
  await tx.wait();

  const domainOwner = await domainContract.getAddress("maguro");
  console.log("Owner of domain maguro:", domainOwner);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  try {
    tx = await domainContract.connect(hacker).withdraw();
    await tx.wait();
  } catch (error) {
    console.log("Could not rob contract");
  }

  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    "Balance of owner before withdrawal:",
    hre.ethers.utils.formatEther(ownerBalance)
  );

  tx = await domainContract.connect(owner).withdraw();
  await tx.wait();

  const contractBalance = await hre.ethers.provider.getBalance(
    domainContract.address
  );
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log(
    "Contract balance after withdrawal:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  console.log(
    "Balance of owner after withdrawal:",
    hre.ethers.utils.formatEther(ownerBalance)
  );
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

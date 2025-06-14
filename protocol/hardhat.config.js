require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  optimizer: {
    enabled: true,
    runs: 2000,
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 2000,
    },
    viaIR: true,
  },
};

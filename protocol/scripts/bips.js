const { BEANSTALK } = require("../test/utils/constants");
const { getBeanstalk, impersonateBeanstalkOwner, mintEth, impersonateSigner } = require("../utils");
const { deployContract } = require("./contracts");
const { upgradeWithNewFacets } = require("./diamond");
const { impersonatePipeline, deployPipeline } = require("./pipeline");

async function bip30(mock = true, account = undefined) {
  if (account == undefined) {
    account = await impersonateBeanstalkOwner();
    await mintEth(account.address);
  }

  await upgradeWithNewFacets({
    diamondAddress: BEANSTALK,
    facetNames: [
      "DepotFacet", // Add Depot
      "TokenSupportFacet", // Add ERC-20 permit function
      "FarmFacet", // Add AdvancedFarm
      "SeasonFacet"
    ],
    bip: false,
    object: !mock,
    verbose: true,
    account: account
  });
}

async function bip29(mock = true, account = undefined) {
  if (account == undefined) {
    account = await impersonateBeanstalkOwner();
    await mintEth(account.address);
  }

  beanstalk = await getBeanstalk();
  await upgradeWithNewFacets({
    diamondAddress: BEANSTALK,
    facetNames: [
      "MarketplaceFacet", // Marketplace V2
      "SiloFacet", // Add Deposit Permit System
      "TokenFacet" // Add ERC-20 Token Approval System
    ],
    selectorsToRemove: ["0xeb6fa84f", "0xed778f8e", "0x72db799f", "0x56e70811", "0x6d679775", "0x1aac9789"],
    bip: false,
    object: !mock,
    verbose: true,
    account: account
  });
}

//BIP for Silo migration to stem
async function bipNewSilo(mock = true, account = undefined) {
  if (account == undefined) {
    account = await impersonateBeanstalkOwner();
    await mintEth(account.address);
  }

  await upgradeWithNewFacets({
    diamondAddress: BEANSTALK,
    facetNames: [
      'SeasonFacet',
      'SiloFacet',
      'ConvertFacet',
      'WhitelistFacet',
      'MigrationFacet',
      'MetadataFacet',
      'TokenFacet',
      'ApprovalFacet',
      'LegacyClaimWithdrawalFacet',
    ],
    initFacetName: 'InitBipNewSilo',
    bip: false,
    object: !mock, //if this is true, something would get spit out in the diamond cuts folder with all the data (due to gnosis safe deployment flow)
    verbose: true,
    account: account
  })
}

//BIP to integration Basin into Beanstalk
async function bipBasinIntegration(mock = true, account = undefined) {
  if (account == undefined) {
    account = await impersonateBeanstalkOwner();
    await mintEth(account.address);
  }

  await upgradeWithNewFacets({
    diamondAddress: BEANSTALK,
    facetNames: [
      'DepotFacet',
      'BDVFacet',
      'ConvertFacet',
      'ConvertGettersFacet',
      'SiloFacet',
      'EnrootFacet',
      'WhitelistFacet',
      'SeasonFacet',
      'MetadataFacet'
    ],
    initFacetName: 'InitBipBasinIntegration',
    bip: false,
    object: !mock, //if this is true, something would get spit out in the diamond cuts folder with all the data (due to gnosis safe deployment flow)
    verbose: true,
    selectorsToRemove: ['0x8f742d16'],
    account: account
  })
}

async function mockBeanstalkAdmin(mock = true, account = undefined) {
  if (account == undefined) {
    account = await impersonateBeanstalkOwner()
    await mintEth(account.address)
  }

  await upgradeWithNewFacets({
    diamondAddress: BEANSTALK,
    facetNames: [
      'MockAdminFacet',
    ],
    bip: false,
    object: !mock,
    verbose: true,
    account: account,
    verify: false
  });
}

async function bip34(mock = true, account = undefined) {
  if (account == undefined) {
    account = await impersonateBeanstalkOwner();
    await mintEth(account.address);
  }

  await upgradeWithNewFacets({
    diamondAddress: BEANSTALK,
    facetNames: [
      "FieldFacet", // Add Morning Auction
      "SeasonFacet", // Add ERC-20 permit function
      "FundraiserFacet" // update fundraiser with new soil spec
    ],
    initFacetName: "InitBipSunriseImprovements",
    selectorsToRemove: ["0x78309c85", "0x6c8d548e"],
    bip: false,
    object: !mock,
    verbose: true,
    account: account,
    verify: false
  });
}

async function bipMigrateUnripeBean3CrvToBeanEth(mock = true, account = undefined, verbose = true, oracleAccount = undefined) {
  if (account == undefined) {
    account = await impersonateBeanstalkOwner();
    await mintEth(account.address);
  }

  await upgradeWithNewFacets({
    diamondAddress: BEANSTALK,
    facetNames: [
      "BDVFacet",
      "ConvertFacet",
      "ConvertGettersFacet",
      "FertilizerFacet",
      "MetadataFacet",
      "MigrationFacet",
      "UnripeFacet",
    ],
    libraryNames: [
      'LibConvert',
      'LibLockedUnderlying',
    ],
    facetLibraries: {
      'ConvertFacet': [
        'LibConvert'
      ],
      'UnripeFacet': [
        'LibLockedUnderlying'
      ]
    },
    initFacetName: "InitMigrateUnripeBean3CrvToBeanEth",
    selectorsToRemove: [
      '0x0bfca7e3',
      '0x8cd31ca0'
    ],
    bip: false,
    object: !mock,
    verbose: verbose,
    account: account,
    verify: false
  });


  if (oracleAccount == undefined) {
    oracleAccount = await impersonateSigner('0x30a1976d5d087ef0BA0B4CDe87cc224B74a9c752', true); // Oracle deployer
    await mintEth(oracleAccount.address);
  }
  await deployContract('UsdOracle', oracleAccount, verbose)

}

async function bipSeedGauge(mock = true, account = undefined, verbose = true) {
  if (account == undefined) {
    account = await impersonateBeanstalkOwner();
    await mintEth(account.address);
  }

  await upgradeWithNewFacets({
    diamondAddress: BEANSTALK,
    facetNames: [
      "SeasonFacet", // Add Seed Gauge system
      "SeasonGettersFacet", // season getters
      "GaugePointFacet", // gauge point function caller
      "UnripeFacet", // new view functions
      "SiloFacet", // new view functions
      "ConvertFacet", // add unripe convert
      "ConvertGettersFacet", // add unripe convert getters
      "WhitelistFacet", // update whitelist abilities.
      "MetadataFacet", // update metadata
      "BDVFacet", // update bdv functions
      "SiloGettersFacet", // add silo getters
      "LiquidityWeightFacet" // add liquidity weight facet
    ],
    initFacetName: "InitBipSeedGauge",
    selectorsToRemove: [],
    libraryNames: [
      'LibGauge', 'LibConvert', 'LibLockedUnderlying', 'LibIncentive', 'LibWellMinting', 'LibGerminate'
    ],
    facetLibraries: {
      'SeasonFacet': [
        'LibGauge',
        'LibIncentive',
        'LibLockedUnderlying',
        'LibWellMinting',
        'LibGerminate'
      ],
      'SeasonGettersFacet': [
        'LibLockedUnderlying',
        'LibWellMinting',
      ],
      'ConvertFacet': [
        'LibConvert'
      ],
      'UnripeFacet': [
        'LibLockedUnderlying'
      ]
    },
    bip: false,
    object: !mock,
    verbose: verbose,
    account: account,
    verify: false
  });
}


async function bipMigrateUnripeBeanEthToBeanSteth(mock = true, account = undefined, verbose = true, oracleAccount = undefined) {
  if (account == undefined) {
    account = await impersonateBeanstalkOwner();
    await mintEth(account.address);
}

  await upgradeWithNewFacets({
    diamondAddress: BEANSTALK,
    facetNames: [
      "BDVFacet",
      "ConvertFacet",
      "ConvertGettersFacet",
      "EnrootFacet",
      "FertilizerFacet",
      "MetadataFacet",
      "MigrationFacet",
      "SeasonFacet",
      "SeasonGettersFacet",
      "UnripeFacet",
      "WhitelistFacet" // update whitelist abilities.
    ],
    libraryNames: [
      'LibGauge',
      'LibIncentive',
      'LibConvert',
      'LibLockedUnderlying',
      'LibWellMinting',
      'LibGerminate'
    ],
    facetLibraries: {
      'ConvertFacet': [
        'LibConvert'
      ],
      'UnripeFacet': [
        'LibLockedUnderlying'
      ],
      'SeasonFacet': [
        'LibGauge',
        'LibIncentive',
        'LibLockedUnderlying',
        'LibWellMinting',
        'LibGerminate'
      ],
      'SeasonGettersFacet': [
        'LibLockedUnderlying',
        'LibWellMinting',
      ],
    },
    initFacetName: "InitMigrateUnripeBeanEthToBeanSteth",
    selectorsToRemove: [],
    bip: false,
    object: !mock,
    verbose: verbose,
    account: account,
    verify: false
  });


  if (oracleAccount == undefined) {
    oracleAccount = await impersonateSigner('0x30a1976d5d087ef0BA0B4CDe87cc224B74a9c752', true); // Oracle deployer
    await mintEth(oracleAccount.address);
  }
  await deployContract('UsdOracle', oracleAccount, verbose)
}


exports.bip29 = bip29
exports.bip30 = bip30
exports.bip34 = bip34
exports.bipNewSilo = bipNewSilo
exports.bipBasinIntegration = bipBasinIntegration
exports.bipSeedGauge = bipSeedGauge
exports.mockBeanstalkAdmin = mockBeanstalkAdmin
exports.bipMigrateUnripeBean3CrvToBeanEth = bipMigrateUnripeBean3CrvToBeanEth
exports.bipMigrateUnripeBeanEthToBeanSteth = bipMigrateUnripeBeanEthToBeanSteth
export const MAX_ALLOWANCE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;

export const exchangeProxy = '0xDef1C0ded9bec7F1a1670819833240f027b25EfF';

/* 
const ETH_TOKENS = {
  eth: {
    chain_id: 1,
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    logo_uri: 'https://www.dextools.io/resources/chains/med/ether.png',
  },
  usdc: {
    is_partner: true,
    chain_id: 1,
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    logo_uri:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  },
  weth: {
    chain_id: 1,
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    logo_uri: 'https://www.dextools.io/resources/chains/med/ether.png',
  },
  pnx: {
    is_partner: true,
    //  isPromo: true,
    chain_id: 1,
    name: 'PhenX',
    address: '0xd166b7d9824cc5359360b47389aba9341ce12619',
    symbol: 'PNX',
    decimals: 9,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xd166b7d9824cc5359360b47389aba9341ce12619.png?1722864698511',
  },
  mdai: {
    chain_id: 1,
    is_partner: true,
    name: 'MindAI',
    address: '0xb549116ac57b47c1b365a890e1d04fd547dfff97',
    symbol: 'MDAI',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xb549116ac57b47c1b365a890e1d04fd547dfff97.png?1710539741076',
  },
  devve: {
    chain_id: 1,
    name: 'DevvE',
    address: '0x8248270620aa532e4d64316017be5e873e37cc09',
    symbol: 'DEVVE',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x8248270620aa532e4d64316017be5e873e37cc09.png?1707335270850',
  },
  dogecoin20: {
    chain_id: 1,
    name: 'Dogecoin20',
    address: '0x2541A36BE4cD39286ED61a3E6AFC2307602489d6',
    symbol: 'DOGE20',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x2541a36be4cd39286ed61a3e6afc2307602489d6.png?1712013377127',
  },
  bank: {
    chain_id: 1,
    name: 'Bank AI',
    address: '0xe18ab3568fa19e0ed38bc1d974eddd501e61e12d',
    symbol: 'BANK',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xf19693068120185664e211f619c4f0530ce07088.png?1710395617674',
  },
  fuxe: {
    chain_id: 1,

    name: 'Fuxion Labs',
    address: '0x3fca2cd116121decd03043fbaba39f60651de903',
    symbol: 'FUXE',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x3fca2cd116121decd03043fbaba39f60651de903.png?1712970083014',
  }, */
/*  
  romu: {
    chain_id: 1,
    name: 'RoboMuMu',
    is_partner: true,
    isPromo: true,

    address: '0x2B04Dfd108F80a0a12E9E0FbA1bf3DE342a87f85',
    symbol: 'ROMU',
    decimals: 18,
    logo_uri: 'https://i.ibb.co/RC4Y5Sb/Robo-Mu-Mu-Logo-1536x1439.webp',
  },
  three: {
    useV2: true,
    is_partner: true,
    isPromo: true,

    chain_id: 1,
    name: 'Three Protocol Tokens',
    address: '0xa059b81568FeE88791de88232e838465826cf419',
    symbol: 'THREE',
    decimals: 9,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xa059b81568fee88791de88232e838465826cf419.jpg?1714426634616',
  },

  ccv2: {
    is_partner: true,

    chain_id: 1,
    name: 'CryptoCart V2',
    address: '0x612e1726435fe38dd49a0b35b4065b56f49c8f11',
    symbol: 'CCv2',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/3/ether/0x612e1726435fe38dd49a0b35b4065b56f49c8f11.png?1696514866',
  },
  inqu: {
    chain_id: 1,
    is_partner: true,

    name: 'IntelliQuant',
    address: '0x31Bd628c038f08537e0229f0D8c0a7b18B0CDa7B',
    symbol: 'INQU',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x31bd628c038f08537e0229f0d8c0a7b18b0cda7b.png?1707339246829',
  },
  tmnt: {
    chain_id: 1,
    name: 'Teenage Mutant Ninja Turtles',
    address: '0x6f6382f241e3c6ee0e9bee2390d91a73adc0afff',
    symbol: 'TMNT',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x6f6382f241e3c6ee0e9bee2390d91a73adc0afff.jpeg?1709466742361',
  },

  fxi: {
    chain_id: 1,
    name: 'FXI Sports',
    address: '0xc5190e7fec4d97a3a3b1ab42dfedac608e2d0793',
    symbol: 'FXI',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xc5190e7fec4d97a3a3b1ab42dfedac608e2d0793.png?1696610834857',
  },

  fbg: {
    chain_id: 1,
    name: 'FortBlockGames',
    address: '0xeb935deb517e4c2abc282e5e251ed4d05db79e93',
    symbol: 'FBG',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xeb935deb517e4c2abc282e5e251ed4d05db79e93.png?1706811683394',
  },

  enigma: {
    chain_id: 1,
    name: 'Enigma Runes Protocol',
    address: '0x9d138cE8c16D19fd227F60B849688d6a9086D256',
    symbol: 'ENIGMA',
    decimals: 9,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x9d138ce8c16d19fd227f60b849688d6a9086d256.png?1713914689935',
  },
  google: {
    chain_id: 1,
    name: 'Deepmind Ai',
    address: '0xc15b1eaec8aade6ce0a94fd44806f623fbf505c9',
    symbol: 'GOOGLE',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xc15b1eaec8aade6ce0a94fd44806f623fbf505c9.png?1709688674869',
  },

  nmai: {
    chain_id: 1,
    name: 'NomotaAI',
    address: '0x837ee5a664d51bc2e7d26eb63cffeb48e037bde2',
    symbol: 'NMAI',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x837ee5a664d51bc2e7d26eb63cffeb48e037bde2.png?1712932651327',
  },

  $raise: {
    chain_id: 1,
    name: 'Raise',
    address: '0x53393e4659803817418b0b6221ac60eb074e2cec',
    symbol: '$RAISE',
    decimals: 9,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x53393e4659803817418b0b6221ac60eb074e2cec.png?1712013377127',
  },
  vra: {
    chain_id: 1,
    name: 'VERA',
    address: '0xf411903cbc70a74d22900a5de66a2dda66507255',
    symbol: 'VRA',
    decimals: 18,
    logo_uri: 'https://i.ibb.co/4WY8g1g/IMG-9554.jpg',
  },
  arbot: {
    chain_id: 1,
    name: 'Arbot',
    address: '0x723696965f47b990dff00064fcaca95f0ee01123',
    symbol: 'ARBOT',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x723696965f47b990dff00064fcaca95f0ee01123.png?1693887378610',
  },

  epets: {
    chain_id: 1,
    name: 'Etherpets',
    address: '0x280df82db83abb0a4c734bb02afc7985a1c8eaf2',
    symbol: 'EPETS',
    decimals: 9,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x280df82db83abb0a4c734bb02afc7985a1c8eaf2.jpg?1706582038236',
  },

  snack: {
    chain_id: 1,
    name: 'SnackboxAI',
    address: '0x578b388528f159d026693c3c103100d36ac2ad65',
    symbol: 'SNACK',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x578b388528f159d026693c3c103100d36ac2ad65.png?1712607014886',
  },

  para: {
    chain_id: 1,
    name: 'Paragon Network',
    address: '0x8F43Ee50942E96D84052253AB13f59C1D942fb98',
    symbol: 'PARA',
    decimals: 9,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x8f43ee50942e96d84052253ab13f59c1d942fb98.png?1712268385738',
  },

  aqua: {
    chain_id: 1,
    name: 'Aqua Stake',
    address: '0x12f9a180198d91f854f3ca23caf8be1c83ef3b76',
    symbol: 'AQUA',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x12f9a180198d91f854f3ca23caf8be1c83ef3b76.jpg?1710964338086',
  },

  axgt: {
    chain_id: 1,
    name: 'AxonDAO Governance Token',
    address: '0xdd66781d0e9a08d4fbb5ec7bac80b691be27f21d',
    symbol: 'AXGT',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xdd66781d0e9a08d4fbb5ec7bac80b691be27f21d.png?1707913818440',
  },

  cai: {
    chain_id: 1,
    name: 'Circe AI',
    address: '0x4ce3c172210b45bd24e568ec0ae3a9a4103a3e8a',
    symbol: 'Cai',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x4ce3c172210b45bd24e568ec0ae3a9a4103a3e8a.png?1710035903246',
  },

  guardai: {
    chain_id: 1,
    name: 'GuardAI',
    address: '0xd1679946ba555ebf5cb38e8b089ef1e1e5d2abb1',
    symbol: 'GuardAI',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xd1679946ba555ebf5cb38e8b089ef1e1e5d2abb1.png?1711329117595',
  },

  xtrack: {
    chain_id: 1,
    name: 'XTrack',
    address: '0xeE372d2b7e7C83DE7e345267b5e4eFC1899a4FAB',
    symbol: 'XTRACK',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xee372d2b7e7c83de7e345267b5e4efc1899a4fab.jpeg?1702524569937',
  },

  gtx: {
    chain_id: 1,
    name: 'Gigantix Wallet Token',
    address: '0x1C001D1C9e8c7B8dC717c714d30b31480ab360F5',
    symbol: 'GTX',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x1c001d1c9e8c7b8dc717c714d30b31480ab360f5.jpeg?1701184954146',
  },

  codex: {
    chain_id: 1,
    name: 'CODEX',
    address: '0xFD26e39807772251c3BB90fb1fCD9CE5b80c5C24',
    symbol: 'CODEX',
    decimals: 9,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xfd26e39807772251c3bb90fb1fcd9ce5b80c5c24.png?1703285382546',
  },

  chrp: {
    chain_id: 1,
    name: 'Chirpley Token',
    address: '0x70Bc0DC6414EB8974BC70685F798838a87d8CCe4',
    symbol: 'CHRP',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/3/ether/0x70bc0dc6414eb8974bc70685f798838a87d8cce4.png?1696526293',
  },

  boom: {
    chain_id: 1,
    name: 'Bomb Shelter Inu',
    address: '0x4c73c1C8c95De5674D53604b15d968485414CB32',
    symbol: 'BOOM',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x4c73c1c8c95de5674d53604b15d968485414cb32.png?1699630491018',
  },

  gmt: {
    chain_id: 1,
    name: 'ColonizeMars',
    address: '0xE8B1e79D937c648Ce1fE96e6739ddb2714058a18',
    symbol: 'GTM',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xe8b1e79d937c648ce1fe96e6739ddb2714058a18.jpg?1707932205649',
  },

  dfx: {
    chain_id: 1,
    name: 'DFX Token',
    address: '0x888888435FDe8e7d4c54cAb67f206e4199454c60',
    symbol: 'DFX',
    decimals: 18,
    logo_uri: 'https://etherscan.io/token/images/dfxtoken_32.png',
  },

  tet: {
    chain_id: 1,
    name: 'Tectum Emission Token',
    address: '0x68A47Fe1CF42eBa4a030a10CD4D6a1031Ca3CA0a',
    symbol: 'TET',
    decimals: 8,
    logo_uri: 'https://etherscan.io/token/images/softnote_32.png',
  },
  type: {
    chain_id: 1,
    name: 'TypeAI',
    address: '0x443459D45c30A03f90037d011CbE22e2183d3b12',
    symbol: 'TYPE',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/3/ether/0x443459d45c30a03f90037d011cbe22e2183d3b12.jpg?1705044610',
  },

  snt: {
    chain_id: 1,
    name: 'Sentinel Bot AI',
    address: '0x78bA134C3ACe18e69837b01703d07f0db6FB0A60',
    symbol: 'SNT',
    decimals: 18,
    logo_uri: 'https://i.ibb.co/K2kWJGr/IMG-9422.png',
  },

  epic: {
    chain_id: 1,
    name: 'EPICBOTS',
    address: '0x680c89c40de9d14aa608a1122363cad18783f837',
    symbol: 'EPIC',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x680c89c40de9d14aa608a1122363cad18783f837.png?1711309999157',
  },

  stelai: {
    chain_id: 1,

    name: 'StellaryAI ',
    address: '0xCD4Ee6c8052Df6742e4B342cF720FF3ac74F415e',
    symbol: 'stelAI',
    decimals: 9,
    logo_uri: 'https://i.ibb.co/K2BwDZW/IMG-9330.png',
  },

  trackr: {
    chain_id: 1,
    name: 'Trackr',
    address: '0x7E6F60e237c34307D516EF80218c2b04BcCbCA40',
    symbol: 'TRACKR',
    decimals: 18,
    logo_uri: 'https://i.ibb.co/4YXM90j/IMG-9145.jpg',
  },

  lndry: {
    chain_id: 1,
    name: 'LNDRY',
    address: '0x613577bFEa8Ba6571F6b7a86716D04c80a3FbEb4',
    symbol: 'LNDRY',
    decimals: 18,
    logo_uri: 'https://i.ibb.co/QjfYSNn/IMG-9146.jpg',
  },

  pulse: {
    chain_id: 1,
    name: 'PULSE AI',
    address: '0xdc7d16b1e7c54f35a67af95d5a6eecaec27b2a62',
    symbol: 'PULSE',
    decimals: 18,
    logo_uri: 'https://i.ibb.co/ZhFK7kT/IMG-9147.jpg',
  },

  dfndr: {
    chain_id: 1,
    name: 'Defender Bot',
    address: '0x3f57c35633cb29834bb7577ba8052eab90f52a02',
    symbol: 'DFNDR',
    decimals: 18,
    logo_uri: 'https://i.ibb.co/9cTQkZ1/IMG-9143.png',
  },

  chiba: {
    chain_id: 1,
    name: 'Chiba Neko',
    address: '0xBE9f4F6c8dAdB2AC61f31Eb1F5171e27D8552dF7',
    symbol: 'CHIBA',
    decimals: 9,
    logo_uri: 'https://i.ibb.co/GF0KY55/IMG-9144.png',
  },




  rddt: {
    chain_id: 1,
    name: 'Reddit',
    address: '0xb9edbe853ddccb4baaf49201be6c39ee1816e120',
    symbol: 'RDDT',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xb9edbe853ddccb4baaf49201be6c39ee1816e120.png?1709725584453',
  },
  azure: {
    chain_id: 1,
    name: 'AZURE WALLET',
    address: '0x1f769203d2abcb78f5a77dd15c0078c50fb13287',
    symbol: 'AZURE',
    decimals: 18,
    logo_uri: 'https://i.ibb.co/C06Ppn1/IMG-8955.jpg',
  },

  '0xScans': {
    chain_id: 1,
    name: '0xScans',
    address: '0x10703ca5e253306e2ababd68e963198be8887c81',
    symbol: 'SCANS',
    decimals: 18,
    logo_uri: 'https://i.ibb.co/hRGYfjY/IMG-8983.jpg',
  },



  ator: {
    chain_id: 1,
    name: 'AirTor Protocol',
    address: '0x0f7b3f5a8fed821c5eb60049538a548db2d479ce',

    symbol: 'ATOR',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x0f7b3f5a8fed821c5eb60049538a548db2d479ce.png?1678831118286',
  },
  vaulttech: {
    chain_id: 1,
    name: 'VaultTech',
    address: '0x7f9b09f4717072cf4dc18b95d1b09e2b30c76790',

    symbol: '$VAULT',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x7f9b09f4717072cf4dc18b95d1b09e2b30c76790.jpeg?1698515624242',
  },
  sect: {
    chain_id: 1,
    name: 'Sect Bot',
    address: '0x24edded3f03abb2e9d047464294133378bddb596',

    symbol: 'SECT',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x24edded3f03abb2e9d047464294133378bddb596.png?1701911627047',
  },
  companionbot: {
    chain_id: 1,
    name: 'CompanionBot',
    symbol: 'CBot',
    address: '0xf49311af05a4ffb1dbf33d61e9b2d4f0a7d4a71c',

    decimals: 9,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xf49311af05a4ffb1dbf33d61e9b2d4f0a7d4a71c.png?1690364311762',
  },

  otsea: {
    chain_id: 1,
    name: 'OTSea',
    symbol: 'OTSea',
    address: '0x5da151b95657e788076d04d56234bd93e409cb09',

    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0x5da151b95657e788076d04d56234bd93e409cb09.png?1706873053022',
  },

  prophet: {
    chain_id: 1,
    name: 'Prophet',
    symbol: 'PROPHET',
    address: '0xa9fbcc25435ad713a9468d8c89dd7baae8914e3a',

    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xa9fbcc25435ad713a9468d8c89dd7baae8914e3a.jpeg?1695037825204',
  },
 */
/*     usdt: {
      is_partner: true,
      chain_id: 1,
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      logo_uri:
        'https://www.dextools.io/resources/tokens/logos/3/mantle/0x201eba5cc46d216ce6dc03f6a759e8e766e956ae.png?1707291114',
    }, */
/*   hodlessbot: {
    chain_id: 1,
    name: 'Hodless BOT',
    symbol: 'HBOT',
    address: '0xf5aed4f6a1ad00f39dd21febb6f400ea020030c2',

    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xf5aed4f6a1ad00f39dd21febb6f400ea020030c2.png?1698001027069',
  },
  shillguardtoken: {
    chain_id: 1,
    name: 'Shill Guard Token',
    address: '0xa0e7626287bd02cbe3531c65148261bf0c0ed98b',

    symbol: 'SGT',
    decimals: 18,
    logo_uri:
      'https://www.dextools.io/resources/tokens/logos/ether/0xa0e7626287bd02cbe3531c65148261bf0c0ed98b.png?1699350137877',
  }, 
};*/
const BASE_TOKENS = {
  1: {
    id: 1,
    chain_id: 8453,
    is_partner: true,
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    logo_uri: 'https://www.dextools.io/resources/chains/med/ether.png',
  },
  2: {
    id: 2,
    chain_id: 8453,
    name: 'Wrapped Ether',
    is_partner: true,
    symbol: 'WETH',
    decimals: 18,
    address: '0x4200000000000000000000000000000000000006',
    logo_uri: 'https://www.dextools.io/resources/chains/med/ether.png',
  },
  3: {
    id: 3,
    is_partner: true,
    chain_id: 8453,
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    logo_uri: 'https://ethereum-optimism.github.io/data/USDC/logo.png',
  },

  4: {
    id: 4,
    chain_id: 8453,
    is_partner: true,
    address: '0xFe86B2Ab783bAB2543798EEA1FD457364c81Ef54',
    name: 'dickbrAIn',
    symbol: 'DICK',
    decimals: 18,
    logo_uri: 'https://i.ibb.co/wRfTnFd/IMG-9855.jpg',
  },
};

const CHAINS = {
  1: {
    name: 'Ethereum',
    chain_id: 1,
    usdcAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    wethAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    ethAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    uniswapRouterAddressV2: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    uniswapFactoryAddressV2: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    uniswapRouterAddressV3: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    uniswapQuoterV3: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
    udxRouterAddress: '0xfa60C635dE9Ea9337C88e3Cb7b00d997bCD8e05c',
  },
  8453: {
    name: 'Base',
    chain_id: 8453,
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    wethAddress: '0x4200000000000000000000000000000000000006',
    ethAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',

    uniswapRouterAddressV2: '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24',
    uniswapFactoryAddressV2: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',
    uniswapRouterAddressV3: '0x2626664c2603336E57B271c5C0b26F421741e481',
    uniswapFactoryAddressV3: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
    uniswapQuoterV3: '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a',
    udxRouterAddress: '0xd94Fe4376Fc177EA46016dccab814D7c821AD70c',
  },
};
// export {ETH_TOKENS};
export {BASE_TOKENS};
export {CHAINS};

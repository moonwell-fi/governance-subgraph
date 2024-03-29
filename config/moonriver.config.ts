import { Config } from './config-types'
import { BigInt } from '@graphprotocol/graph-ts'

const config = new Config(
  '0x2BE2e230e89c59c8E20E633C524AD2De246e7370', // Governor Address
  '0x0000000000000000000000000000000000000000', // Multi Governor Address
  BigInt.fromI32(0),                            // proposalOffset
  '0x0000000000000000000000000000000000000000', // Vote Collector Address
  BigInt.fromI32(1285),                         // Vote Collector Chain ID
  '0x0000000000000000000000000000000000000000', // Wormhole Address
  '0x04e6322D196E0E4cCBb2610dd8B8f2871E160bd7', // Timelock Address
  '0xBb8d88bcD9749636BC4D2bE22aaC4Bb3B01A58F1', // MFAM Address
  BigInt.fromI32(1462096),                      // MFAM Start Block
  [                                             // MFAM Circulating Supply Excludes
    '0x0000000000000000000000000000000000000000', // Burn Address
    '0x45dd368e30c07804b037260071d332e547c874f0', // Liquidity Incentives multisig
    '0x5d6C4DCb86b8A761C062a5274a77AaD5F7209AA3', // Developer Grants multisig
    '0xceA318618B4b956a84E5feBC1Cae1F4c33A01F8B', // C-GLMR-APPDEV multisig
    '0x845B93e3305901923306727085a12D5B22899F0f', // C-GLMR-TEAM multisig
    '0x8568a675384d761f36ec269d695d6ce4423cfab1', // Claims contract
    '0x0b7a0EAA884849c6Af7a129e899536dDDcA4905E', // Comptroller
    '0xbA17581Bb6d89954B42fB84294e476e97588908B', // ECOSYSTEM_RESERVE
    '0x79a1a71786a325db7Fe70bbF080a1ee046F53c74', // Solarbeam Rewarder
    '0x017eFfFd8ABea3B1891f81e7c0E5166458B3584D', // F-MOVR-PARAM
  ],
  BigInt.fromI64(0),                              // MFAM Circulating Supply Manual Subtract
  BigInt.fromI32(0),                              // MFAM Circulating Supply Manual Subtract End Timestamp
  '0x0000000000000000000000000000000000000000',   // xMFAM Address
  BigInt.fromI32(2147483646),                     // xMFAM Start Block
  [                                               // xMFAM Circulating Supply Excludes
    '0x0000000000000000000000000000000000000000', // Burn Address
  ],
  '0x0000000000000000000000000000000000000000',   // xMFAM Lockbox Address
)

export default config

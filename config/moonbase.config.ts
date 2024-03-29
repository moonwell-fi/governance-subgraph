import { Config } from './config-types'
import { BigInt } from '@graphprotocol/graph-ts'

const config = new Config(
  '0x5713dd9a2b2ce515cf9232f48b457aebfb04b292', // Governor Address
  '0xf152d75fe4cBB11AE224B94110c31F0bdDb55850', // Multi Governor Address
  BigInt.fromI32(97),                           // proposalOffset
  '0x0000000000000000000000000000000000000000', // Vote Collector Address
  BigInt.fromI32(1287),                         // Vote Collector Chain ID
  '0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901', // Wormhole Address
  '0x43A720C2690B00Ae0a0F9E4b79ED24184D9e8F0A', // Timelock Address
  '0x96d50c8b4072A1246d40c4455D7b6D748f7D4BD3', // WELL Address
  BigInt.fromI32(4763312),                      // WELL Start Block
  [                                             // WELL Circulating Supply Excludes
    '0x0000000000000000000000000000000000000000', // Burn Address
    '0x751E27d340EFe99e35C4E68f9c3dF94BB4BE2aEA', // xWELL Lockbox
  ],
  BigInt.fromI64(0),                            // WELL Circulating Supply Manual Subtract
  BigInt.fromI32(0),                            // WELL Circulating Supply Manual Subtract End Timestamp
  '0xE8F339C51cb2700113ec6ef552eE1D6cCA3BfB95', // xWELL Address
  BigInt.fromI32(6158357),                      // xWELL Start Block
  [                                             // xWELL Circulating Supply Excludes
    '0x0000000000000000000000000000000000000000' // Burn Address
  ],
  '0x751E27d340EFe99e35C4E68f9c3dF94BB4BE2aEA', // xWELL Lockbox Address
)

export default config

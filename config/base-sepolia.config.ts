import { Config } from './config-types'
import { BigInt } from '@graphprotocol/graph-ts'

const config = new Config(
  '0x0000000000000000000000000000000000000000', // Governor Address
  '0x0000000000000000000000000000000000000000', // Multi Governor Address
  BigInt.fromI32(97),                           // proposalOffset
  '0xBdD86164da753C1a25e72603d266Dc1CC32e8acf', // Vote Collector Address
  BigInt.fromI32(84532),                        // Vote Collector Chain ID
  '0x79A1027a6A159502049F10906D333EC57E95F083', // Wormhole Address
  '0x0000000000000000000000000000000000000000', // Timelock Address
  '0x0000000000000000000000000000000000000000', // WELL Address
  BigInt.fromI32(2147483646),                   // WELL Start Block
  [],                                           // WELL Circulating Supply Excludes
  '0xE8F339C51cb2700113ec6ef552eE1D6cCA3BfB95', // xWELL Address
  BigInt.fromI32(6643795),                      // xWELL Start Block   
  [                                             // xWELL Circulating Supply Excludes
    '0x0000000000000000000000000000000000000000', // Burn Address
  ],
  '0x0000000000000000000000000000000000000000', // xWELL Lockbox Address
)

export default config

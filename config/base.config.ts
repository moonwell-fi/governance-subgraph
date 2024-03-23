import { Config } from './config-types'
import { BigInt } from '@graphprotocol/graph-ts'

const config = new Config(
  '0x0000000000000000000000000000000000000000', // Governor Address
  '0x0000000000000000000000000000000000000000', // Multi Governor Address
  BigInt.fromI32(97),                           // proposalOffset
  '0xe0278B32c627FF6fFbbe7de6A18Ade145603e949', // Vote Collector Address
  BigInt.fromI32(8453),                         // Vote Collector Chain ID
  '0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6', // Wormhole Address
  '0x0000000000000000000000000000000000000000', // Timelock Address
  '0x0000000000000000000000000000000000000000', // WELL Address
  BigInt.fromI32(2147483646),                   // WELL Start Block
  [],                                           // WELL Circulating Supply Excludes
  '0xA88594D404727625A9437C3f886C7643872296AE', // xWELL Address
  BigInt.fromI32(8981602),                      // xWELL Start Block
  [                                             // xWELL Circulating Supply Excludes
    '0x0000000000000000000000000000000000000000', // Burn Address
    '0x74Cbb1E8B68dDD13B28684ECA202a351afD45EAa', // F-BASE
    '0x7CEEf5D34448E127252f621EDfFCb57DCDBac5b1', // F-AERO
    '0xe9005b078701e2A0948D2EaC43010D35870Ad9d2', // Base MultiRewardDistributor
    '0x60A0164463f3dC6c27e0AF42D1F64ab8BF225578', // Luke F-GLMR-PARAM (for bridging)'
  ],
  '0x0000000000000000000000000000000000000000', // xWELL Lockbox Address
)

export default config

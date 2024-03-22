import { Config } from './config-types'
import { BigInt } from '@graphprotocol/graph-ts'

const config = new Config(
  '0x0000000000000000000000000000000000000000',
  '0xbebdb6C8ddC678FfA9f8748f85C815C556Dd8ac6',
  '0x0000000000000000000000000000000000000000',
  '0x0000000000000000000000000000000000000000',
  BigInt.fromI32(2147483646),
  [
    '0x0000000000000000000000000000000000000000', // Burn Address
  ],
  [],
  '0xA88594D404727625A9437C3f886C7643872296AE',
  BigInt.fromI32(8981602),
  [
    '0x0000000000000000000000000000000000000000', // Burn Address
    '0x74Cbb1E8B68dDD13B28684ECA202a351afD45EAa', // F-BASE
    '0x7CEEf5D34448E127252f621EDfFCb57DCDBac5b1', // F-AERO
    '0xe9005b078701e2A0948D2EaC43010D35870Ad9d2', // Base MultiRewardDistributor
    '0x60A0164463f3dC6c27e0AF42D1F64ab8BF225578', // Luke F-GLMR-PARAM (for bridging)'
  ],
  '0x0000000000000000000000000000000000000000',
)

export default config

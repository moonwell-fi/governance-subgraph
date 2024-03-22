import { Config } from './config-types'
import { BigInt } from '@graphprotocol/graph-ts'

const config = new Config(
  '0x0000000000000000000000000000000000000000',
  '0x79A1027a6A159502049F10906D333EC57E95F083',
  '0x0000000000000000000000000000000000000000',
  '0x0000000000000000000000000000000000000000',
  BigInt.fromI32(2147483646),
  [
    '0x0000000000000000000000000000000000000000', // Burn Address
  ],
  [],
  '0xE8F339C51cb2700113ec6ef552eE1D6cCA3BfB95',
  BigInt.fromI32(6643795),
  [
    '0x0000000000000000000000000000000000000000', // Burn Address
  ],
  '0x0000000000000000000000000000000000000000',
)

export default config

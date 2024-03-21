import { Config } from './config-types'
import { BigInt } from '@graphprotocol/graph-ts'

const config = new Config(
  '0x5713dd9a2b2ce515cf9232f48b457aebfb04b292',
  '0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901',
  '0x43A720C2690B00Ae0a0F9E4b79ED24184D9e8F0A',
  '0x96d50c8b4072A1246d40c4455D7b6D748f7D4BD3',
  BigInt.fromI32(4763312),
  [
    '0x0000000000000000000000000000000000000000', // Burn Address
    '0x751E27d340EFe99e35C4E68f9c3dF94BB4BE2aEA', // xWELL Lockbox
  ],
  '0xE8F339C51cb2700113ec6ef552eE1D6cCA3BfB95',
  BigInt.fromI32(6158357),
  [
    '0x0000000000000000000000000000000000000000' // Burn Address
  ],
  '0x751E27d340EFe99e35C4E68f9c3dF94BB4BE2aEA',
)

export default config

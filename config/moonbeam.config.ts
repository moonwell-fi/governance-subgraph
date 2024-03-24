import { Config } from './config-types'
import { BigInt } from '@graphprotocol/graph-ts'

const config = new Config(
  '0xfc4DFB17101A12C5CEc5eeDd8E92B5b16557666d', // Governor Address
  '0x9A8464C4C11CeA17e191653Deb7CdC1bE30F1Af4', // Multi Governor Address
  BigInt.fromI32(79),                           // proposalOffset
  '0x0000000000000000000000000000000000000000', // Vote Collector Address
  BigInt.fromI32(1284),                         // Vote Collector Chain ID
  '0xC8e2b0cD52Cf01b0Ce87d389Daa3d414d4cE29f3', // Wormhole Address
  '0x3a9249d70dCb4A4E9ef4f3AF99a3A130452ec19B', // Timelock Address
  '0x511aB53F793683763E5a8829738301368a2411E3', // WELL Address
  BigInt.fromI32(1005779),                      // WELL Start Block
  [                                             // WELL Circulating Supply Excludes
    '0x0000000000000000000000000000000000000000', // Burn Address
    '0x519ee031e182d3e941549e7909c9319cff4be69a', // C-GLMR-APPDEV
    '0xe4b19a9944060b14504936b5e58bcc06a747b738', // C-GLMR-TEAM
    '0xf2248fa0b30e5f8c6e4501e3222e935ca38b4b0f', // F-GLMR-PRIVATE
    '0x6972f25ab3fc425eaf719721f0ebd1cdb58ee451', // F-GLMR-LM
    '0xf130e4946f862f2c6ca3d007d51c21688908e006', // F-GLMR-DEVGRANT
    '0x1bc67c936e4c1b99f980bd6dd15c0bf169df0eba', // F-GLMR-PUBLIC
    '0xFFA353daCD27071217EA80D3149C9d500B0e9a38', // F-GLMR-PARAM
    '0x60A0164463f3dC6c27e0AF42D1F64ab8BF225578', // Luke F-GLMR-PARAM (for bridging)
    '0x933fCDf708481c57E9FD82f6BAA084f42e98B60e', // Claims Contract
    '0x8E00D5e02E65A19337Cdba98bbA9F84d4186a180', // Comptroller
    '0x7793E08Eb4525309C46C9BA394cE33361A167ba4', // ECOSYSTEM_RESERVE
    '0xcD04D2340c1dD9B3dB2C5c53c8B8bAa57b2654Be', // StellaSwap Rewarder
    '0x0D45033775b290D69462944289b7A402a651B460', // xWELLLockBox
  ],
  BigInt.fromI64(89120732550000000000000000),     // WELL Circulating Supply Manual Subtract
  BigInt.fromI32(1711868400),                     // WELL Circulating Supply Manual Subtract End Timestamp
  '0xA88594D404727625A9437C3f886C7643872296AE',   // xWELL Address
  BigInt.fromI32(5259170),                        // xWELL Start Block
  [                                               // xWELL Circulating Supply Excludes
    '0x0000000000000000000000000000000000000000', // Burn Address
    '0x60A0164463f3dC6c27e0AF42D1F64ab8BF225578', // Luke F-GLMR-PARAM (for bridging)
  ],
  '0x0D45033775b290D69462944289b7A402a651B460',   // xWELL Lockbox Address
)

export default config

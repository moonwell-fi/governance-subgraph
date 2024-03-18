import {
  BigInt,
  ethereum,
} from '@graphprotocol/graph-ts'
import config from '../config/config'

export const BIGINT_ZERO = BigInt.fromI32(0)
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export namespace ProposalState {
  export const CREATED = 'CREATED'
  export const CANCELED = 'CANCELED'
  export const EXECUTED = 'EXECUTED'
  export const QUEUED = 'QUEUED'
}

export namespace GovernanceVoteValue {
  export const VOTE_VALUE_YES = 0
  export const VOTE_VALUE_NO = 1
  export const VOTE_VALUE_ABSTAIN = 2
}

export function getOrElse<T>(result: ethereum.CallResult<T>, defaultValue: T): T {
  if (result.reverted) {
    return defaultValue
  }
  return result.value
}

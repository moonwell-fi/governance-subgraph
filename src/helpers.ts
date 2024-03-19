import {
  BigInt,
  ethereum,
  log,
} from '@graphprotocol/graph-ts'
import {
  CirculatingSupplyDailySnapshot
} from '../generated/schema'
import config from '../config/config'

export const BIGINT_ZERO = BigInt.fromI32(0)
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export let secondsPerDay = 24 * 60 * 60

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

export function getEpochDays(blockTimestamp: i32): i32 {
  return blockTimestamp / secondsPerDay
}

export function getOrCreateCirculatingSupplyDailySnapshot(
  blockTimestamp: i32,
  contractAddress: string,
): CirculatingSupplyDailySnapshot {
  let snapshotID = contractAddress
    .toLowerCase()
    .concat('-')
    .concat(getEpochDays(blockTimestamp).toString()
  )
  log.info('[getOrCreateCirculatingSupplyDailySnapshot] snapshotID: {}', [snapshotID])
  let snapshot = CirculatingSupplyDailySnapshot.load(snapshotID)
  if (!snapshot) {
    log.warning('[getOrCreateCirculatingSupplyDailySnapshot] Creating new snapshot for {}', [snapshotID])
    snapshot = new CirculatingSupplyDailySnapshot(snapshotID)
    snapshot.circulatingSupply = BIGINT_ZERO
    snapshot.save()
  }
  return snapshot
}

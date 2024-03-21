import { ethereum, log, Address, Bytes, BigInt } from '@graphprotocol/graph-ts'
import {
  Transfer,
  DelegateChanged,
  DelegateVotesChanged,
  WELL as WELLContract,
} from '../generated/WELL/WELL'
import {
  snapshotCirculatingSupplyXwell
} from './xwell'
import {
  Account
} from '../generated/schema'
import config from '../config/config'
import {
  BIGINT_ZERO,
  ADDRESS_ZERO,
  getOrCreateCirculatingSupplyDailySnapshot,
} from './helpers'

export function snapshotCirculatingSupplyWell(blockTimestamp: i32): void {
  if (blockTimestamp < 1704096000) return; // Don't snapshot before 01-01-2024
  let snapshot = getOrCreateCirculatingSupplyDailySnapshot(
    blockTimestamp,
    config.WELLAddr
  )
  if (snapshot.captureTimestamp != BIGINT_ZERO) return; // Already captured
  let contract = WELLContract.bind(Address.fromString(config.WELLAddr))
  let totalSupply = contract.totalSupply()
  for (let i = 0; i < config.WELLCircSupplyExcludes.length; i++) {
    let excludeAddress = Address.fromString(config.WELLCircSupplyExcludes[i]);
    let balance = contract.balanceOf(excludeAddress);
    totalSupply = totalSupply.minus(balance);
  }
  snapshot.circulatingSupply = totalSupply
  snapshot.captureTimestamp = BigInt.fromI32(blockTimestamp)
  snapshot.save()
}

export function handleTransfer(event: Transfer): void {
  let fromAccount = Account.load(event.params.from.toHexString())
  if (fromAccount == null) {
    fromAccount = new Account(event.params.from.toHexString())
    fromAccount.votingPower = BIGINT_ZERO
    fromAccount.xvotingPower = BIGINT_ZERO
    fromAccount.WELLBalance = BIGINT_ZERO
    fromAccount.xWELLBalance = BIGINT_ZERO
    fromAccount.delegatedTo = ADDRESS_ZERO
    fromAccount.xdelegatedTo = ADDRESS_ZERO
    fromAccount.totalDeposits = BIGINT_ZERO
    fromAccount.totalWithdrawals = BIGINT_ZERO
  }
  fromAccount.WELLBalance = fromAccount.WELLBalance.minus(event.params.amount)
  fromAccount.save()

  let toAccount = Account.load(event.params.to.toHexString())
  if (toAccount == null) {
    toAccount = new Account(event.params.to.toHexString())
    toAccount.votingPower = BIGINT_ZERO
    toAccount.xvotingPower = BIGINT_ZERO
    toAccount.WELLBalance = BIGINT_ZERO
    toAccount.xWELLBalance = BIGINT_ZERO
    toAccount.delegatedTo = ADDRESS_ZERO
    toAccount.xdelegatedTo = ADDRESS_ZERO
    toAccount.totalDeposits = BIGINT_ZERO
    toAccount.totalWithdrawals = BIGINT_ZERO
  }
  toAccount.WELLBalance = toAccount.WELLBalance.plus(event.params.amount)
  toAccount.save()
  snapshotCirculatingSupplyWell(event.block.timestamp.toI32())
  if ((config.xWELLAddr != ADDRESS_ZERO) && (event.block.number.ge(config.xWELLStartBlock))) {
    snapshotCirculatingSupplyXwell(event.block.timestamp.toI32())
  }
}

export function handleDelegateChanged(event: DelegateChanged): void {
  let account = Account.load(event.params.delegator.toHexString())
  if (account == null) {
    account = new Account(event.params.delegator.toHexString())
    account.votingPower = BIGINT_ZERO
    account.xvotingPower = BIGINT_ZERO
    account.WELLBalance = BIGINT_ZERO
    account.xWELLBalance = BIGINT_ZERO
    account.delegatedTo = event.params.toDelegate.toHexString()
    account.xdelegatedTo = ADDRESS_ZERO
    account.totalDeposits = BIGINT_ZERO
    account.totalWithdrawals = BIGINT_ZERO
    account.save()
  } else {
    account.delegatedTo = event.params.toDelegate.toHexString()
    account.save()
  }
}

export function handleDelegateVotesChanged(event: DelegateVotesChanged): void {
  let account = Account.load(event.params.delegate.toHexString())
  if (account == null) {
    account = new Account(event.params.delegate.toHexString())
    account.WELLBalance = BIGINT_ZERO
    account.xWELLBalance = BIGINT_ZERO
    account.delegatedTo = ADDRESS_ZERO
    account.xdelegatedTo = ADDRESS_ZERO
    account.totalDeposits = BIGINT_ZERO
    account.totalWithdrawals = BIGINT_ZERO
    account.votingPower = event.params.newBalance
    account.xvotingPower = BIGINT_ZERO
    account.save()
  } else {
    account.votingPower = event.params.newBalance
    account.save()
  }
}

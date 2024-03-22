import { ethereum, log, Address, Bytes, BigInt } from '@graphprotocol/graph-ts'
import {
  Transfer,
  WormholeWELL as WormholeWELLContract,
} from '../generated/WormholeWELL/WormholeWELL'
import {
  Account
} from '../generated/schema'
import config from '../config/config'
import {
  BIGINT_ZERO,
  ADDRESS_ZERO,
  getOrCreateCirculatingSupplyDailySnapshot,
} from './helpers'

export function snapshotCirculatingSupplyWWell(blockTimestamp: i32): void {
  if (blockTimestamp < 1704096000) return; // Don't snapshot before 01-01-2024
  let snapshot = getOrCreateCirculatingSupplyDailySnapshot(
    blockTimestamp,
    config.WWELLAddr
  )
  if (snapshot.captureTimestamp != BIGINT_ZERO) return; // Already captured
  let contract = WormholeWELLContract.bind(Address.fromString(config.WWELLAddr))
  let totalSupply = contract.totalSupply()
  for (let i = 0; i < config.WWELLCircSupplyExcludes.length; i++) {
    let excludeAddress = Address.fromString(config.WWELLCircSupplyExcludes[i]);
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
    fromAccount.WWELLBalance = BIGINT_ZERO
    fromAccount.totalDeposits = BIGINT_ZERO
    fromAccount.totalWithdrawals = BIGINT_ZERO
  }
  fromAccount.WWELLBalance = fromAccount.WWELLBalance.minus(event.params.value)
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
    toAccount.WWELLBalance = BIGINT_ZERO
    toAccount.totalDeposits = BIGINT_ZERO
    toAccount.totalWithdrawals = BIGINT_ZERO
  }
  toAccount.WWELLBalance = toAccount.WWELLBalance.plus(event.params.value)
  toAccount.save()
  snapshotCirculatingSupplyWWell(event.block.timestamp.toI32())
}

import { ethereum, log, Address, Bytes, BigInt } from '@graphprotocol/graph-ts'
import {
  BreakGlassGuardianChanged,
  ProposalCanceled,
  ProposalCreated,
  ProposalExecuted,
  ProposalQueued,
  ProposalThresholdChanged,
  QuroumVotesChanged,
  VoteCast,
  VotingDelayChanged,
  VotingPeriodChanged,
  Governor as GovernorContract,
} from '../generated/Governor/Governor'
import { LogMessagePublished } from '../generated/Wormhole/Wormhole'
import {
  Governor,
  Proposal,
  ProposalStateChange,
  Proposer,
  Vote,
  Voter,
  Message,
} from '../generated/schema'
import config from '../config/config'
import {
  BIGINT_ZERO,
  getOrElse,
  GovernanceVoteValue,
  ProposalState,
} from './helpers'

export function handleProposalCreated(event: ProposalCreated): void {
  let governor = getOrCreateGovernor()
  governor.proposalCount += 1
  governor.save()

  let proposerID = event.params.proposer.toHexString()
  let proposer = Proposer.load(proposerID)
  if (!proposer) {
    proposer = new Proposer(proposerID)
    proposer.save()
  }

  let proposalID = event.params.id.toString()
  let proposal = new Proposal(proposalID)
  proposal.proposalID = event.params.id.toI32()
  proposal.proposer = proposerID
  let targets: Bytes[] = []
  for (let i = 0; i < event.params.targets.length; i++) {
    targets.push(event.params.targets[i])
  }
  proposal.targets = targets
  proposal.values = event.params.values
  proposal.signatures = event.params.signatures
  proposal.calldatas = event.params.calldatas
  proposal.startTimestamp = event.params.startTimestamp
  proposal.endTimestamp = event.params.endTimestamp
  proposal.startBlock = event.block.number
  proposal.description = event.params.description
  proposal.canceled = false
  proposal.executed = false
  proposal.forVotes = BigInt.zero()
  proposal.againstVotes = BigInt.zero()
  proposal.abstainVotes = BigInt.zero()
  proposal.totalVotes = BigInt.zero()
  proposal.save()

  newProposalStateChange(event, proposalID, ProposalState.CREATED)
}

export function handleProposalQueued(event: ProposalQueued): void {
  let proposalID = event.params.id.toString()
  let proposal = Proposal.load(proposalID)
  if (!proposal) {
    log.warning('[handleProposalQueued] proposal {} not found', [proposalID])
    return
  }

  let change = newProposalStateChange(event, proposalID, ProposalState.QUEUED)
  change.queueEta = event.params.eta
  change.save()
}

export function handleProposalExecuted(event: ProposalExecuted): void {
  let proposalID = event.params.id.toString()
  let proposal = Proposal.load(proposalID)
  if (!proposal) {
    log.warning('[handleProposalExecuted] proposal {} not found', [proposalID])
    return
  }

  proposal.executed = true
  proposal.save()

  newProposalStateChange(event, proposalID, ProposalState.EXECUTED)
}

export function handleProposalCanceled(event: ProposalCanceled): void {
  let proposalID = event.params.id.toString()
  let proposal = Proposal.load(proposalID)
  if (!proposal) {
    log.warning('[handleProposalCanceled] proposal {} not found', [proposalID])
    return
  }

  proposal.canceled = true
  proposal.save()

  newProposalStateChange(event, proposalID, ProposalState.CANCELED)
}

export function handleVoteCast(event: VoteCast): void {
  let proposalID = event.params.proposalId.toString()
  let proposal = Proposal.load(proposalID)
  if (!proposal) {
    log.warning('[handleVoteCast] proposal {} not found', [proposalID])
    return
  }

  switch (event.params.voteValue) {
    case GovernanceVoteValue.VOTE_VALUE_YES:
      proposal.forVotes = proposal.forVotes.plus(event.params.votes)
      break
    case GovernanceVoteValue.VOTE_VALUE_NO:
      proposal.againstVotes = proposal.againstVotes.plus(event.params.votes)
      break
    case GovernanceVoteValue.VOTE_VALUE_ABSTAIN:
      proposal.abstainVotes = proposal.abstainVotes.plus(event.params.votes)
      break
    default:
  }
  proposal.totalVotes = proposal.totalVotes.plus(event.params.votes)
  proposal.save()

  let voterID = event.params.voter.toHexString()
  let voter = Voter.load(voterID)
  if (!voter) {
    voter = new Voter(voterID)
    voter.save()
  }

  let vote = new Vote(
    event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString()),
  )
  vote.txnHash = event.transaction.hash
  vote.blockNumber = event.block.number
  vote.voter = voterID
  vote.proposal = proposalID
  vote.voteValue = event.params.voteValue
  vote.votes = event.params.votes
  vote.save()
}

export function handleBreakGlassGuardianChanged(event: BreakGlassGuardianChanged): void {
  let governor = getOrCreateGovernor()
  governor.breakGlassGuardian = event.params.newValue
  governor.save()
}

export function handleProposalThresholdChanged(event: ProposalThresholdChanged): void {
  let governor = getOrCreateGovernor()
  governor.proposalThreshold = event.params.newValue
  governor.save()
}

export function handleQuorumVotesChanged(event: QuroumVotesChanged): void {
  let governor = getOrCreateGovernor()
  governor.quorumVotes = event.params.newValue
  governor.save()
}

export function handleVotingDelayedChanged(event: VotingDelayChanged): void {
  let governor = getOrCreateGovernor()
  governor.votingDelay = event.params.newValue.toI32()
  governor.save()
}

export function handleVotingPeriodChanged(event: VotingPeriodChanged): void {
  let governor = getOrCreateGovernor()
  governor.votingPeriod = event.params.newValue.toI32()
  governor.save()
}

export function handleLogMessagePublished(event: LogMessagePublished): void {
  if (event.params.sender.toHexString().toLowerCase() != config.timelockAddr.toLowerCase()) {
    return // only handle messages from our trusted sender (timelock address)
  }
  let message = new Message(
    event.transaction.hash.toHexString(),
  )
  message.sender = event.params.sender
  message.sequence = event.params.sequence
  message.nonce = event.params.nonce.toI32()
  message.payload = event.params.payload
  message.consistencyLevel = event.params.consistencyLevel
  message.timestamp = event.block.timestamp
  message.save()
}

function getOrCreateGovernor(): Governor {
  let governor = Governor.load('1')
  if (!governor) {
    let contract = GovernorContract.bind(Address.fromString(config.governorAddr))
    governor = new Governor('1')
    governor.proposalCount = 0
    governor.quorumVotes = getOrElse<BigInt>(contract.try_quorumVotes(), BIGINT_ZERO)
    governor.proposalThreshold = getOrElse<BigInt>(
      contract.try_proposalThreshold(),
      BIGINT_ZERO,
    )
    governor.votingDelay = getOrElse<BigInt>(
      contract.try_votingDelay(),
      BIGINT_ZERO,
    ).toI32()
    governor.proposalMaxOperations = getOrElse<BigInt>(
      contract.try_proposalMaxOperations(),
      BIGINT_ZERO,
    ).toI32()
    governor.votingPeriod = getOrElse<BigInt>(
      contract.try_votingPeriod(),
      BIGINT_ZERO,
    ).toI32()
    governor.breakGlassGuardian = getOrElse<Address>(
      contract.try_breakGlassGuardian(),
      Address.fromString('0x0000000000000000000000000000000000000000'),
    )
    governor.timelock = getOrElse<Address>(
      contract.try_timelock(),
      Address.fromString('0x0000000000000000000000000000000000000000'),
    )
    governor.save()
  }
  return governor
}

function newProposalStateChange(
  event: ethereum.Event,
  proposalID: string,
  newState: string,
): ProposalStateChange {
  let proposalStateChangeID = 
    event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString());
  let change = new ProposalStateChange(proposalStateChangeID)
  let message = Message.load(event.transaction.hash.toHexString())
  if (message) {
    message.proposalStateChange = proposalStateChangeID
    message.save()
  }
  change.proposal = proposalID
  change.txnHash = event.transaction.hash
  change.blockNumber = event.block.number
  change.newState = newState
  change.save()

  return change
}

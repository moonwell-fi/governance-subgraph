import { ethereum, log, Address, Bytes, BigInt } from '@graphprotocol/graph-ts'
import {
  ProposalCanceled,
  ProposalCreated,
  ProposalExecuted,
  ProposalQueued,
  ProposalRebroadcasted,
  VoteCast,
  BreakGlassGuardianChanged,
  ProposalThresholdChanged,
  QuroumVotesChanged,
  VotingPeriodChanged,
  CrossChainVoteCollected,
  MultiGovernor as MultiGovernorContract,
} from '../generated/MultiGovernor/MultiGovernor'
import {
  MultiGovernor,
  Proposal,
  ProposalStateChange,
  Proposer,
  Vote,
  CrossChainVoteTotal,
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
  let governor = getOrCreateMultiGovernor()
  governor.proposalCount += 1
  governor.save()

  let proposerID = event.params.proposer.toHexString()
  let proposer = Proposer.load(proposerID)
  if (!proposer) {
    proposer = new Proposer(proposerID)
    proposer.save()
  }

  let proposalID = (event.params.id.plus(config.proposalOffset)).toString()
  let proposal = new Proposal(proposalID)
  proposal.proposalID = event.params.id.toI32()
  proposal.proposer = proposerID
  let targets: Bytes[] = []
  for (let i = 0; i < event.params.targets.length; i++) {
    targets.push(event.params.targets[i])
  }
  proposal.targets = targets
  proposal.values = event.params.values
  let signatures: string[] = []
  for (let i = 0; i < proposal.calldatas.length; i++) {
    signatures.push('')
  }
  proposal.signatures = signatures
  proposal.calldatas = event.params.calldatas
  proposal.startTimestamp = event.params.votingStartTime
  proposal.endTimestamp = event.params.votingEndTime
  proposal.startBlock = event.block.number
  proposal.description = event.params.description
  proposal.canceled = false
  proposal.executed = false
  proposal.forVotes = BigInt.zero()
  proposal.againstVotes = BigInt.zero()
  proposal.abstainVotes = BigInt.zero()
  proposal.totalVotes = BigInt.zero()
  proposal.remoteForVotes = BigInt.zero()
  proposal.remoteAgainstVotes = BigInt.zero()
  proposal.remoteAbstainVotes = BigInt.zero()
  proposal.remoteTotalVotes = BigInt.zero()
  proposal.save()

  newProposalStateChange(event, proposalID, ProposalState.CREATED)
}

export function handleProposalQueued(event: ProposalQueued): void {
  let proposalID = (event.params.id.plus(config.proposalOffset)).toString()
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
  let proposalID = (event.params.id.plus(config.proposalOffset)).toString()
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
  let proposalID = (event.params.id.plus(config.proposalOffset)).toString()
  let proposal = Proposal.load(proposalID)
  if (!proposal) {
    log.warning('[handleProposalCanceled] proposal {} not found', [proposalID])
    return
  }

  proposal.canceled = true
  proposal.save()

  newProposalStateChange(event, proposalID, ProposalState.CANCELED)
}

export function handleProposalRebroadcasted(event: ProposalRebroadcasted): void {
  let proposalID = (event.params.proposalId.plus(config.proposalOffset)).toString()
  let proposal = Proposal.load(proposalID)
  if (!proposal) {
    log.warning('[handleProposalRebroadcasted] proposal {} not found', [proposalID])
    return
  }

  let change = newProposalStateChange(event, proposalID, ProposalState.REBROADCASTED)
  change.save()
}

export function handleCrossChainVoteCollected(event: CrossChainVoteCollected): void {
  let proposalID = (event.params.proposalId.plus(config.proposalOffset)).toString()
  let proposal = Proposal.load(proposalID)
  if (!proposal) {
    log.warning('[handleCrossChainVoteCollected] proposal {} not found', [proposalID])
    return
  }

  let crossChainVoteTotalID = (
    event.params.sourceChain.toString()
    .concat('-')
    .concat(proposalID)
  )
  let crossChainVoteTotal = CrossChainVoteTotal.load(crossChainVoteTotalID)
  if (!crossChainVoteTotal) {
    crossChainVoteTotal = new CrossChainVoteTotal(crossChainVoteTotalID)
    crossChainVoteTotal.proposal = proposalID
    crossChainVoteTotal.sourceChain = BigInt.fromU32(event.params.sourceChain)
    crossChainVoteTotal.forVotes = event.params.forVotes
    crossChainVoteTotal.againstVotes = event.params.againstVotes
    crossChainVoteTotal.abstainVotes = event.params.abstainVotes
    crossChainVoteTotal.broadcastTimestamp = event.block.timestamp
    crossChainVoteTotal.blockNumber = event.block.number
    proposal.remoteForVotes = proposal.remoteForVotes.plus(event.params.forVotes)
    proposal.remoteAgainstVotes = proposal.remoteAgainstVotes.plus(event.params.againstVotes)
    proposal.remoteAbstainVotes = proposal.remoteAbstainVotes.plus(event.params.abstainVotes)
    proposal.remoteTotalVotes = proposal.remoteTotalVotes.plus(
      event.params.forVotes
      .plus(event.params.againstVotes)
      .plus(event.params.abstainVotes)
    )
    crossChainVoteTotal.save()
    proposal.save()
  } else {
    log.warning('[handleCrossChainVoteCollected] crossChainVoteTotal {} already exists in tx hash {}', [crossChainVoteTotalID, event.transaction.hash.toHexString()])
  }
}

export function handleVoteCast(event: VoteCast): void {
  let proposalID = (event.params.proposalId.plus(config.proposalOffset)).toString()
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
  vote.timestamp = event.block.timestamp
  vote.voter = voterID
  vote.proposal = proposalID
  vote.voteValue = event.params.voteValue
  vote.votes = event.params.votes
  vote.save()
}

export function handleBreakGlassGuardianChanged(event: BreakGlassGuardianChanged): void {
  let governor = getOrCreateMultiGovernor()
  governor.breakGlassGuardian = event.params.newValue
  governor.save()
}

export function handleProposalThresholdChanged(event: ProposalThresholdChanged): void {
  let governor = getOrCreateMultiGovernor()
  governor.proposalThreshold = event.params.newValue
  governor.save()
}

export function handleQuorumVotesChanged(event: QuroumVotesChanged): void {
  let governor = getOrCreateMultiGovernor()
  governor.quorumVotes = event.params.newValue
  governor.save()
}

export function handleVotingPeriodChanged(event: VotingPeriodChanged): void {
  let governor = getOrCreateMultiGovernor()
  governor.votingPeriod = event.params.newValue.toI32()
  governor.save()
}

function getOrCreateMultiGovernor(): MultiGovernor {
  let governor = MultiGovernor.load('1')
  if (!governor) {
    let contract = MultiGovernorContract.bind(Address.fromString(config.governorAddr))
    governor = new MultiGovernor('1')
    governor.proposalCount = 0
    governor.quorumVotes = getOrElse<BigInt>(contract.try_quorum(), BIGINT_ZERO)
    governor.proposalThreshold = getOrElse<BigInt>(
      contract.try_proposalThreshold(),
      BIGINT_ZERO,
    )
    governor.votingPeriod = getOrElse<BigInt>(
      contract.try_votingPeriod(),
      BIGINT_ZERO,
    ).toI32()
    governor.breakGlassGuardian = getOrElse<Address>(
      contract.try_breakGlassGuardian(),
      Address.fromString('0x0000000000000000000000000000000000000000'),
    )
    governor.pauseGuardian = getOrElse<Address>(
      contract.try_pauseGuardian(),
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

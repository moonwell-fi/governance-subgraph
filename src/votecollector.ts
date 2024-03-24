import { ethereum, log, Address, Bytes, BigInt } from '@graphprotocol/graph-ts'
import {
  ProposalCreated,
  VoteCast,
  VotesEmitted,
  VoteCollector as VoteCollectorContract,
} from '../generated/VoteCollector/VoteCollector'
import {
  CrossChainProposal,
  Vote,
  VoteCollector,
  CrossChainVoteTotal,
  Voter,
} from '../generated/schema'
import config from '../config/config'
import {
  BIGINT_ZERO,
  GovernanceVoteValue,
} from './helpers'

function getOrCreateVoteCollector(event: ProposalCreated): VoteCollector {
  let voteCollectorID = (
    config.voteCollectorAddr
    .concat('-')
    .concat(config.voteCollectorChainID.toString())
  )

  let voteCollector = VoteCollector.load(voteCollectorID)
  if (!voteCollector) {
    let contract = VoteCollectorContract.bind(Address.fromString(config.voteCollectorAddr))
    voteCollector = new VoteCollector(voteCollectorID)
    voteCollector.proposalCount = 0
    voteCollector.save()
  }
  return voteCollector
}

export function handleProposalCreated(event: ProposalCreated): void {
  let voteCollector = getOrCreateVoteCollector(event)
  voteCollector.proposalCount += 1
  voteCollector.save()

  let crossChainProposal = new CrossChainProposal(
    config.voteCollectorAddr
    .concat('-')
    .concat(event.params.proposalId.toString())
  )
  crossChainProposal.voteCollector = config.voteCollectorAddr
  crossChainProposal.proposalID = event.params.proposalId
  crossChainProposal.proposalIDOffset = config.proposalOffset
  crossChainProposal.startTimestamp = event.params.votingStartTime
  crossChainProposal.endTimestamp = event.params.votingEndTime
  crossChainProposal.voteCollectionEndTimestamp = event.params.votingCollectionEndTime
  crossChainProposal.startBlock = event.block.number
  crossChainProposal.forVotes = BIGINT_ZERO
  crossChainProposal.againstVotes = BIGINT_ZERO
  crossChainProposal.abstainVotes = BIGINT_ZERO
  crossChainProposal.totalVotes = BIGINT_ZERO
  crossChainProposal.broadcastTimestamp = BIGINT_ZERO
  crossChainProposal.save()
}

export function handleVoteCast(event: VoteCast): void {
  let proposalID = (
    config.voteCollectorAddr
    .concat('-')
    .concat(event.params.proposalId.toString())
  )
  let proposal = CrossChainProposal.load(proposalID)
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

export function handleVotesEmitted(event: VotesEmitted): void {
  let proposalID = (
    config.voteCollectorAddr
    .concat('-')
    .concat(event.params.proposalId.toString())
  )
  let proposal = CrossChainProposal.load(proposalID)
  if (!proposal) {
    log.warning('[handleVotesEmitted] proposal {} not found', [proposalID])
    return
  }
  let crossChainVoteTotalID = (
    config.voteCollectorChainID.toString()
    .concat('-')
    .concat(event.params.proposalId.toString())
  )
  let crossChainVoteTotal = CrossChainVoteTotal.load(crossChainVoteTotalID)
  if (!crossChainVoteTotal) {
    crossChainVoteTotal = new CrossChainVoteTotal(crossChainVoteTotalID)
    crossChainVoteTotal.proposal = proposalID
    crossChainVoteTotal.sourceChain = config.voteCollectorChainID
    crossChainVoteTotal.forVotes = event.params.forVotes
    crossChainVoteTotal.againstVotes = event.params.againstVotes
    crossChainVoteTotal.abstainVotes = event.params.abstainVotes
    crossChainVoteTotal.broadcastTimestamp = event.block.timestamp
    crossChainVoteTotal.blockNumber = event.block.number
    crossChainVoteTotal.save()
  } else {
    log.warning('[handleVotesEmitted] crossChainVoteTotal {} was already broadcasted at timestamp {}, rebroadcasting.', [crossChainVoteTotalID, crossChainVoteTotal.broadcastTimestamp.toString()])
    crossChainVoteTotal.broadcastTimestamp = event.block.timestamp
    crossChainVoteTotal.save()
  }

  proposal.broadcastTimestamp = event.block.timestamp
  proposal.save()
}

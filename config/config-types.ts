import { BigInt } from "@graphprotocol/graph-ts";

export class Config {
  constructor(
    public readonly governorAddr: string,
    public readonly multiGovernorAddr: string,
    public readonly proposalOffset: BigInt,
    public readonly voteCollectorAddr: string,
    public readonly voteCollectorChainID: BigInt,
    public readonly wormholeAddr: string,
    public readonly timelockAddr: string,
    public readonly WELLAddr: string,
    public readonly WELLStartBlock: BigInt,
    public readonly WELLCircSupplyExcludes: Array<string>,
    public readonly xWELLAddr: string,
    public readonly xWELLStartBlock: BigInt,
    public readonly xWELLCircSupplyExcludes: Array<string>,
    public readonly lockboxAddr: string,
  ) {}
}

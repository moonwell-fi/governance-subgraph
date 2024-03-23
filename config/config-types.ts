import { BigInt } from "@graphprotocol/graph-ts";

export class Config {
  constructor(
    public readonly governorAddr: string,
    public readonly multiGovernorAddr: string,
    public readonly voteCollectorAddr: string,
    public readonly wormholeAddr: string,
    public readonly timelockAddr: string,
    public readonly WELLAddr: string,
    public readonly WELLStartBlock: BigInt,
    public readonly WELLCircSupplyExcludes: Array<string>,
    public readonly WELLBaseExtraExcludes: Array<string>,
    public readonly xWELLAddr: string,
    public readonly xWELLStartBlock: BigInt,
    public readonly xWELLCircSupplyExcludes: Array<string>,
    public readonly WWELLAddr: string,
    public readonly WWELLCircSupplyExcludes: Array<string>,
    public readonly lockboxAddr: string,
  ) {}
}

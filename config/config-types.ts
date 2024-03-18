export class Config {
  constructor(
    public readonly governorAddr: string,
    public readonly wormholeAddr: string,
    public readonly timelockAddr: string,
    public readonly WELLAddr: string,
    public readonly xWELLAddr: string,
    public readonly lockboxAddr: string,
  ) {}
}

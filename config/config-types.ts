export class Config {
  constructor(
    public readonly governorAddr: string,
    public readonly wormholeAddr: string,
    public readonly timelockAddr: string,
  ) {}
}

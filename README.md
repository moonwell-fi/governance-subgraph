# Moonwell Governance Subgraph

[Moonwell](https://moonwell.fi/) is an open lending and borrowing DeFi protocol on Base, Moonbeam and Moonriver. This Subgraph ingests the governance contracts of the protocol.

## Networks and Performance

This subgraph can be found on The Graph Hosted Service at https://thegraph.com/hosted-service/subgraph/moonwell-fi/moonwell-governance.

You can also run this subgraph locally, if you wish. Instructions for that can be found in [The Graph Documentation](https://thegraph.com/docs/quick-start).

### ABI

The ABI used is `governor.json`.

## Getting started with querying

Below are a few ways to show how to query the Moonwell Subgraph for data. The queries show most of the information that is queryable, but there are many other filtering options that can be used, just check out the [querying api](https://github.com/graphprotocol/graph-node/blob/master/docs/graphql-api.md).

You can also see the saved queries on the hosted service for examples.

## Local Dev Environment Setup

Set the following environment variables:
- `GITHUB_DEV_PROFILE` = Your Github dev profile name where you have created hosted subgraphs for each network
- `GRAPH_DEV_ACCESS_TOKEN` = Your deployment key for the development instances of hosted subgraphs
- `SATSUMA_ACCESS_TOKEN` = Your deployment key for Satsuma's hosted service

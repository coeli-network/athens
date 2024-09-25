import * as ajs from "azimuth-js";
import * as uob from "urbit-ob";
import Web3 from "web3";
import { coinbaseWallet } from "./coinbaseWallet";

export async function getOwnedIds(address: string) {
  // XX should we move this somewhere else?
  const infuraId = process.env.INFURA_ID!;
  const network = process.env.ETH_NETWORK!;
  const azimuthContract = process.env.AZIMUTH_CONTRACT!;
  const web3 = new Web3(`https://${network}.infura.io/v3/${infuraId}`);
  const ob = uob.default;

  console.log("initializing contracts");
  const contracts = await ajs.initContractsPartial(web3, azimuthContract);
  console.log("getting point count");
  const pointCount = await ajs.azimuth.getOwnedPointCount(contracts, address);
  console.log("pointCount", pointCount);
  if (pointCount === 0) {
    throw new Error("No Urbit IDs found for this address.");
  }
  console.log("getting points");
  const points = await ajs.azimuth.getOwnedPoints(contracts, address);
  console.log(ob);
  const ids = points.map((p: any) => ob.patp(p.toString()));
  console.log("ids", ids);
  return ids;
}

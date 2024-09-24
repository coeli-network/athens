import * as azimuth from "azimuth-js";
import { coinbaseWallet } from "./coinbaseWallet";

export async function getUrbitIDs(address: string) {
  const pointCount = await azimuth.getOwnedPointCount(coinbaseWallet, address);
  if (pointCount === 0) {
    throw new Error("No Urbit IDs found for this address.");
  }
  const points = await azimuth.getOwnedPoints(coinbaseWallet, address);
  return points;
}

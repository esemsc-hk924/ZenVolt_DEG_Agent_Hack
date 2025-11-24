export const TRONSCAN_NILE = "https://nile.tronscan.org/#";

export function txUrl(txid: string) {
  return `${TRONSCAN_NILE}/transaction/${txid}`;
}
export function addressUrl(addr: string) {
  return `${TRONSCAN_NILE}/address/${addr}`;
}
export function contractUrl(addr: string) {
  return `${TRONSCAN_NILE}/contract/${addr}`;
}

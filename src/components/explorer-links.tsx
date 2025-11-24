import { ExternalLink } from "lucide-react";
import { addressUrl, contractUrl } from "@/lib/explorer";

export default function ExplorerLinks() {
  const z = process.env.NEXT_PUBLIC_ZVOLT_REWARDS_ADDRESS!;
  const pre = process.env.NEXT_PUBLIC_PRE_REGISTRY_ADDRESS!;
  const badge = process.env.NEXT_PUBLIC_CARBON_BADGE_ADDRESS!;
  return (
    <div className="space-y-2 text-sm">
      <div>
        ZVOLT: <a className="text-blue-600 hover:underline inline-flex items-center gap-1" href={contractUrl(z)} target="_blank">{z} <ExternalLink className="h-3 w-3" /></a>
      </div>
      <div>
        PRE: <a className="text-blue-600 hover:underline inline-flex items-center gap-1" href={contractUrl(pre)} target="_blank">{pre} <ExternalLink className="h-3 w-3" /></a>
      </div>
      <div>
        Badge: <a className="text-blue-600 hover:underline inline-flex items-center gap-1" href={contractUrl(badge)} target="_blank">{badge} <ExternalLink className="h-3 w-3" /></a>
      </div>
    </div>
  );
}

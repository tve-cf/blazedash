import { Subscription } from "cloudflare/resources/shared";
import { Zone } from "cloudflare/resources/zones/zones";
import { cfClient, fetchCloudflare } from "./cloudflare";
import { ZoneSchema } from "~/lib/schemas/cloudflare";
import { ZoneWithSubscription } from "~/types/cloudflare";

export async function getZones(apiToken: string) {
  const accountList = await cfClient(apiToken).accounts.list();
  const accountId = accountList.result[0].id;

  const subscription = await cfClient(apiToken).accounts.subscriptions.get({
    account_id: accountId,
  });

  const zones = await cfClient(apiToken).zones.list({
    per_page: 50,
  });

  const zonesWithSubscriptions = [...(zones.result as ZoneWithSubscription[])];

  subscription.result.forEach((subscription) => {
    const sub = subscription as Subscription & {
      zone: { id: string; name: string };
    };

    if (sub.zone) {
      const zoneIndex = zonesWithSubscriptions.findIndex(
        (z) => z.id === sub.zone.id
      );

      zones.result.forEach((zone) => {
        if (
          zone.id === sub.zone.id &&
          !zonesWithSubscriptions[zoneIndex].subscriptions
        ) {
          zonesWithSubscriptions[zoneIndex].subscriptions = [sub];
        } else if (
          zone.id === sub.zone.id &&
          zonesWithSubscriptions[zoneIndex].subscriptions
        ) {
          zonesWithSubscriptions[zoneIndex].subscriptions.push(sub);
        }
      });
    }
  });

  return zonesWithSubscriptions;
}

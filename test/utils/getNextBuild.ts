import type Parcel from "@parcel/core";
import type { BuildEvent } from "@parcel/types";

/** When parcel is running in watch mode, this will wait for the next build to complete. */
export function getNextBuild(b: Parcel): Promise<BuildEvent> {
  return new Promise((resolve, reject) => {
    const subscriptionPromise = b
      .watch((err, buildEvent) => {
        if (err) {
          reject(err);
          return;
        }
        subscriptionPromise
          .then((subscription) => {
            // If the watch callback was reached, subscription must have been successful
            if (subscription == null) throw new Error("subscription doesn't exist");
            return subscription.unsubscribe();
          })
          .then(() => {
            // If the build promise hasn't been rejected, buildEvent must exist
            if (buildEvent == null) throw new Error("buildEvent doesn't exist");
            resolve(buildEvent);
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

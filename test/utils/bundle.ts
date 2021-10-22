import { bundler, IBundlerConfig, IBundlerTools } from "./bundler";

/** Bundles a test project with parcel. */
export async function bundle(config: IBundlerConfig): Promise<IBundlerTools> {
  const { parcel, ...bundlerTools } = bundler(config);
  await parcel.run();
  return { ...bundlerTools };
}

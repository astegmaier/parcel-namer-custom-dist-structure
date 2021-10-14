import path from "path";
import { bundle } from "./test-utils/bundle";

describe("parcel-namer-custom-dist-structure", () => {
  it("puts .js bundles in a 'scripts' folder, based on configuration", async () => {
    const { outputFS, distDir } = await bundle(path.join(__dirname, "test-utils/project1/src/index.html"));
    const output = await outputFS.readdir(distDir);
    expect(output).toEqual(["scripts", "index.html"]);

    const scriptsOutput = await outputFS.readdir(path.join(distDir, "scripts"));
    expect(scriptsOutput).toEqual(["a.js", "a.js.map"]);
  });

  it.skip("Invalidates cache when config changes", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Does not invalidate cache when unrelated parts of package.json change", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Can handle a mixture of both folder => extension[] entries and extension => folder entries", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Can handle extensions with multiple parts (e.g. '.d.ts')", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Throws an error when an invalid configuration is present", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Can handle multiple build targets gracefully without conflict", () => {
    throw new Error("Not Implemented");
  });

  it.skip("Can handle projects where package.json (with config) is at the same level of folder as the target", () => {
    throw new Error("Not Implemented");
  });
});

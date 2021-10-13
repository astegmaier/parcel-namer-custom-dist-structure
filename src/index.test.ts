import path from "path";
import { bundle } from "./test-utils/bundle";

describe("parcel-namer-custom-dist-structure", () => {
  it("puts .js bundles in a 'scripts' folder", async () => {
    const { outputFS, distDir } = await bundle(path.join(__dirname, "test-utils/project1"));

    const output = await outputFS.readdir(distDir);
    expect(output).toEqual(["scripts", "index.html"]);

    const scriptsOutput = await outputFS.readdir(path.join(distDir, "scripts"));
    expect(scriptsOutput).toEqual(["a.js", "a.js.map"]);
  });
});

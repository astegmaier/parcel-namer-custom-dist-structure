import path from "path";
import { assertMatches } from "./assert";
import { bundle } from "./bundle";

describe("parcel-namer-custom-dist-structure", () => {
  beforeEach(() => jest.setTimeout(20000));

  it("puts .js bundles in a 'scripts' folder, based on configuration", async () => {
    const { outputFS, distDir } = await bundle(path.join(__dirname, "projects/simple/src/index.html"));
    const output = await outputFS.readdir(distDir);
    expect(output.sort()).toEqual(["index.html", "scripts"]);

    const scriptsOutput = await outputFS.readdir(path.join(distDir, "scripts"));
    assertMatches(scriptsOutput, [/a\.[a-f0-9]*\.js/, /a\.[a-f0-9]*\.js.map/]);
  });

  it.skip("Invalidates cache when config changes", async () => {
    throw new Error("Not Implemented");
  });

  it.skip("Does not invalidate cache when unrelated parts of package.json change", async () => {
    throw new Error("Not Implemented");
  });

  it("Can handle a mixture of both folder => extension[] entries and extension => folder entries", async () => {
    const { outputFS, distDir } = await bundle(path.join(__dirname, "projects/complex/src/index.html"));
    const output = await outputFS.readdir(distDir);
    expect(output.sort()).toEqual(["images", "index.html", "js", "layout", "scalable-images"]);

    const imagesOutput = await outputFS.readdir(path.join(distDir, "images"));
    assertMatches(imagesOutput, [/clock\.[a-f0-9]*\.png/, /image\.[a-f0-9]*\.jpg/]);

    const scriptsOutput = await outputFS.readdir(path.join(distDir, "js"));
    assertMatches(scriptsOutput, [/a\.[a-f0-9]*\.js/, /a\.[a-f0-9]*\.js.map/, /b\.[a-f0-9]*\.js/, /b\.[a-f0-9]*\.js.map/]);

    const layoutOutput = await outputFS.readdir(path.join(distDir, "layout"));
    assertMatches(layoutOutput, [
      /style1\.[a-f0-9]*\.css/,
      /style1\.[a-f0-9]*\.css.map/,
      /style2\.[a-f0-9]*\.css/,
      /style2\.[a-f0-9]*\.css.map/,
      /style3\.[a-f0-9]*\.css/,
      /style3\.[a-f0-9]*\.css.map/,
    ]);

    const scalableImagesOutput = await outputFS.readdir(path.join(distDir, "scalable-images"));
    assertMatches(scalableImagesOutput, [/path\.[a-f0-9]*\.svg/]);
  });

  it.skip("Can handle extensions with multiple parts (e.g. '.d.ts')", async () => {
    throw new Error("Not Implemented");
  });

  it.skip("Throws an error when an invalid configuration is present", async () => {
    throw new Error("Not Implemented");
  });

  it.skip("Can handle multiple build targets gracefully without conflict", async () => {
    throw new Error("Not Implemented");
  });

  it.skip("Can handle projects where package.json (with config) is at the same level of folder as the target", async () => {
    throw new Error("Not Implemented");
  });

  it("By default, bundling in development mode ignores dist structure customization", async () => {
    const { outputFS, distDir } = await bundle(path.join(__dirname, "projects/simple/src/index.html"), { mode: "development" });
    const output = await outputFS.readdir(distDir);
    assertMatches(output, [/index\.[a-f0-9]*\.js/, /index\.[a-f0-9]*\.js.map/, "index.html"]);
  });

  it("Setting options:development: true, causes dist structure customization to be respected in development mode", async () => {
    const { outputFS, distDir } = await bundle(path.join(__dirname, "projects/development-true/src/index.html"), { mode: "development" });
    const output = await outputFS.readdir(distDir);
    expect(output.sort()).toEqual(["index.html", "scripts"]);

    const scriptsOutput = await outputFS.readdir(path.join(distDir, "scripts"));
    assertMatches(scriptsOutput, [/a\.[a-f0-9]*\.js/, /a\.[a-f0-9]*\.js.map/]);
  });

  it.skip("Should not append content hashes to content types that need stable names (e.g. HTML, linked references, libraries, etc.)", async () => {
    throw new Error("Not Implemented");
  });
});

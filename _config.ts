import lume from "lume/mod.ts";
const site = lume();
site.copy("assets");
site.copy("style.css");
site.copy("main.js");

const BASE_PATH = "" as const;

function parseObsidian(content: string) {
  return prependBasePathToAssets(content, BASE_PATH);
}

function prependBasePathToAssets(content: string, basePath: string) {
  return content.replace(
    /(src|href)="\/?([^"]+)"/g,
    (_, attr, path: string) => {
      path = path.trim();
      if (/^(\/|#|data)/.test(path)) {
        return `${attr}="${path}"`;
      }
      if (path.startsWith("http") || path.startsWith("mailto")) {
        return `${attr}="${path}" target="_blank"`;
      }
      if (path.endsWith(".md")) {
        return `${attr}="${basePath}/${path.replace(/\.md$/, "")}"`;
      }
      return `${attr}="${basePath}/${path}"`;
    }
  );
}

site.process([".md"], (assets) => {
  for (const asset of assets) {
    asset.content = parseObsidian(asset.content as string);
  }
});

export default site;

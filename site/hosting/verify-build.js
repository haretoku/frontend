#!/usr/bin/env node
// Sitesの配信規約に必要なclient/server分離を，公開前に検査する．

import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";


const hostingDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(hostingDirectory, "../..");
const outputRoot = resolve(repositoryRoot, "dist");

await Promise.all([
  access(resolve(outputRoot, "client/index.html")),
  access(resolve(outputRoot, "server/index.js")),
  access(resolve(outputRoot, ".openai/hosting.json"))
]);

const workerConfig = JSON.parse(
  await readFile(resolve(outputRoot, "server/wrangler.json"), "utf8")
);

if (workerConfig.assets?.binding !== "ASSETS") {
  throw new Error("配信設定にASSETS bindingがありません．");
}

if (workerConfig.assets?.directory !== "../client") {
  throw new Error("静的ファイルの参照先がdist/clientではありません．");
}

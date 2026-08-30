#!/usr/bin/env node
// site配下のVite成果物を，Sitesが受け取るルートdistへ移す．

import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";


const hostingDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(hostingDirectory, "../..");
const source = resolve(repositoryRoot, "site/dist");
const destination = resolve(repositoryRoot, "dist");

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
await mkdir(resolve(destination, "server"), { recursive: true });
await copyFile(
  resolve(repositoryRoot, "site/hosting/worker.js"),
  resolve(destination, "server/index.js")
);
await rm(source, { recursive: true, force: true });
await rm(resolve(repositoryRoot, "site/.openai"), { recursive: true, force: true });

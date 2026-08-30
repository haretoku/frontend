#!/usr/bin/env node
// SitesがsiteをViteルートとして扱えるよう，公開設定を一時配置する．

import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";


const hostingDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(hostingDirectory, "../..");
const source = resolve(repositoryRoot, ".openai/hosting.json");
const destination = resolve(repositoryRoot, "site/.openai/hosting.json");

await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);

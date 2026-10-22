import {manualPages} from '../manual/routes.js';
import {journeyRoutes} from '../map/routes.js';
import { writeFile } from "node:fs/promises";
import {finalizeStaticAssets} from "./finalize-static-assets.js";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const output = resolve(root, "dist-pages");
const paths = [...manualPages.map(page=>page.path),...Object.values(journeyRoutes).filter(path=>path!=='/'),"/", "/guides/", "/press/", ...["self-consumption", "solar-economics", "subsidies", "disaster", "quotes-contractors", "solar-electricity-savings", "solar-fit", "solar-installation-cost", "solar-maintenance-cost", "subsidy-amount", "electricity-support-end"].map(name => `/guides/${name}/`), ...["policy", "calculation-method"].map(name => `/pages/${name}.html`)];
await writeFile(resolve(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path => `  <url><loc>https://haretoku.jp${path}</loc></url>`).join("\n")}\n</urlset>\n`);
await writeFile(resolve(output, "robots.txt"), "User-agent: *\nAllow: /\n\nSitemap: https://haretoku.jp/sitemap.xml\n");
await writeFile(resolve(output, ".nojekyll"), "");
await writeFile(resolve(output, "CNAME"), "haretoku.jp\n");
await finalizeStaticAssets({root,output});

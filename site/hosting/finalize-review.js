import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {finalizeStaticAssets} from './finalize-static-assets.js';

const root=resolve(import.meta.dirname,'../..');
const output=resolve(root,'dist-review');
await finalizeStaticAssets({root,output});
await writeFile(resolve(output,'robots.txt'),'User-agent: *\nDisallow: /\n');
const info=JSON.parse(await readFile(resolve(root,'site/hosting/preview-site.json'),'utf8'));
const pkg=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
await writeFile(resolve(output,'preview-info.json'),JSON.stringify({purpose:'private-review',baseVersion:pkg.version,baseCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),builtAt:new Date().toISOString(),origin:info.origin,entry:'/guides/self-consumption/',analytics:false,affiliateTracking:false},null,2)+'\n');

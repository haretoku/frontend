import {cp,mkdir,readFile,writeFile,readdir,lstat,rm} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import assert from 'node:assert/strict';
import {verifyReview,reviewOutput} from './verify-review.js';

const root=resolve(import.meta.dirname,'../..');
const stage=resolve(root,'.preview-upload');
await verifyReview();
await mkdir(stage,{recursive:true});
assert(!(await lstat(stage)).isSymbolicLink(),'stageは実ディレクトリに限る');
const permitted=new Set(['.git','.openai','dist']);
assert((await readdir(stage)).every(name=>permitted.has(name)),'stageに配信物以外があるため停止');
const target=resolve(stage,'dist');
assert(relative(root,target)===['.preview-upload','dist'].join(sep),'削除対象は確認用stageのdistだけに限定');
try{assert(!(await lstat(target)).isSymbolicLink(),'stage/distをsymlinkにしない');await rm(target,{recursive:true,force:true});}catch(error){if(error.code!=='ENOENT')throw error;}
await cp(reviewOutput,target,{recursive:true,dereference:false});
await mkdir(resolve(stage,'.openai'),{recursive:true});
const info=JSON.parse(await readFile(resolve(root,'site/hosting/preview-site.json'),'utf8'));
const manifest=resolve(stage,'.openai/hosting.json');
try{const current=JSON.parse(await readFile(manifest,'utf8'));assert.equal(current.project_id,info.project_id);}catch(error){if(error.code!=='ENOENT')throw error;}
await writeFile(manifest,JSON.stringify({project_id:info.project_id,static:{directory:'dist'}},null,2)+'\n');
await verifyReview(target);
console.log('確認用アップロードstage準備完了：生成したdistとSites識別子だけ．開発ソース・QA・秘密情報は含めない．');

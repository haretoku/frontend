import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export const basePath = '/__local/municipal-review/';
const auditFile = new URL('../../../../backend/data/candidates/municipal-subsidies/2026-kanto-coverage-audit.json', import.meta.url);
const reportFile = new URL('../../../../backend/data/docs/収集レポート/市区町村補助金/2026-関東-充足確認.md', import.meta.url);

export async function loadReviewData() {
  const [auditText, report] = await Promise.all([readFile(auditFile, 'utf8'), readFile(reportFile, 'utf8')]);
  const audit = JSON.parse(auditText);
  const records = audit.records.filter(record => record.reclassification).map(record => ({
    prefecture_code: record.prefecture_code, prefecture_name: record.prefecture_name,
    municipality_name: record.municipality_name,
    original_url: record.official_url, original_checked_at: record.confirmed_at,
    original_reasons: record.unresolved_reasons, original_evidence: record.evidence,
    reclassification: record.reclassification
  }));
  return { records, audit: audit.reclassification_audit, report };
}

export function isLoopbackHost(host) {
  try { return ['localhost', '127.0.0.1', '[::1]'].includes(new URL(`http://${host}`).hostname); }
  catch { return false; }
}

export function localMunicipalReview() {
  return {
    name: 'local-municipal-review', apply: 'serve',
    configureServer(server) {
      server.watcher.add([fileURLToPath(auditFile), fileURLToPath(reportFile)]);
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url ?? '').split('?')[0];
        if (!pathname.startsWith(basePath) && pathname !== basePath.slice(0, -1)) return next();
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        if (!isLoopbackHost(req.headers.host)) { res.statusCode = 403; return res.end('Localhost only'); }
        if (!['GET', 'HEAD'].includes(req.method)) { res.statusCode = 405; return res.end('Read only'); }
        if (pathname === basePath.slice(0, -1)) { res.statusCode = 302; res.setHeader('Location', basePath); return res.end(); }
        const route = pathname.slice(basePath.length);
        try {
          let body;
          let type;
          if (route === 'data.json') { body = JSON.stringify(await loadReviewData()); type = 'application/json'; }
          else if (route === 'source.json') { body = await readFile(auditFile); type = 'application/json'; }
          else if (route === 'report.md') { body = await readFile(reportFile); type = 'text/plain'; }
          else if (['', 'index.html', 'view.js', 'styles.css', 'model.js'].includes(route)) {
            const file = route || 'index.html';
            body = await readFile(new URL(file, import.meta.url));
            type = file.endsWith('.html') ? 'text/html' : file.endsWith('.css') ? 'text/css' : 'text/javascript';
          } else { res.statusCode = 404; return res.end('Not found'); }
          res.setHeader('Content-Type', `${type}; charset=utf-8`);
          res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'");
          res.end(req.method === 'HEAD' ? undefined : body);
        } catch (error) {
          server.config.logger.error(`Local municipal review: ${error.message}`);
          res.statusCode = 500; res.end('正本を読み込めません．ローカルファイルを確認してください．');
        }
      });
    }
  };
}

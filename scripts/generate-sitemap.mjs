import fs from 'fs';
import path from 'path';

const siteBase = process.env.SITE_BASE || '/';
const outPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
const pages = ['','research','blog','members','news','philosophy','join'];

// read posts from src/content/posts
const postsDir = path.resolve(process.cwd(), 'src', 'content', 'posts');
let postFiles = [];
try {
  postFiles = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
} catch (e) {
  // no posts
  postFiles = [];
}

// attempt to read member ids from src/data/members.ts to include member profile pages
let memberIds = [];
try {
  const membersRaw = fs.readFileSync(path.resolve(process.cwd(), 'src', 'data', 'members.ts'), 'utf8');
  const idMatches = [...membersRaw.matchAll(/id:\s*"([a-zA-Z0-9_-]+)"/g)];
  memberIds = idMatches.map((m) => m[1]).filter(Boolean);
} catch (e) {
  memberIds = [];
}

const urls = [];
for (const p of pages) {
  urls.push({ loc: path.posix.join(siteBase, p), priority: p === '' ? '1.0' : '0.7' });
}
for (const f of postFiles) {
  const slug = f.replace(/\.md$/, '');
  urls.push({ loc: path.posix.join(siteBase, 'blog', slug), priority: '0.6' });
}
for (const id of memberIds) {
  urls.push({ loc: path.posix.join(siteBase, 'members', id), priority: '0.5' });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`)
  .join('\n')}\n</urlset>\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, xml, 'utf8');
console.log('Wrote sitemap with', urls.length, 'entries to', outPath);

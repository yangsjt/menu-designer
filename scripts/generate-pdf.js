#!/usr/bin/env node

'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');

/* ═══════════════════════════════════
   Configuration
═══════════════════════════════════ */

const PROJECT_ROOT = path.resolve(__dirname, '..');

const MENU_CONFIG = {
  wall: {
    file: 'wall-menu.html',
    label: '墙面菜单',
    viewport: { width: 1250, height: 600 },
    pdfSize: { width: '1250mm', height: '600mm' },
  },
  a4: {
    file: 'a4-menu.html',
    label: 'A4 立牌菜单',
    viewport: { width: 210, height: 297 },
    pdfSize: { width: '210mm', height: '297mm' },
  },
};

const VALID_THEMES = ['default', 'cny', 'spring', 'summer', 'autumn'];
const VALID_LAYOUTS = ['a', 'b'];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

/* ═══════════════════════════════════
   CLI Argument Parsing
═══════════════════════════════════ */

function parseArgs(argv) {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const menuArg = args[0];
  if (!['wall', 'a4', 'all'].includes(menuArg)) {
    console.error(`Error: Unknown menu type "${menuArg}". Use wall, a4, or all.`);
    process.exit(1);
  }

  const menus = menuArg === 'all' ? ['wall', 'a4'] : [menuArg];
  let theme = 'default';
  let layout = 'a';
  let outputDir = path.join(PROJECT_ROOT, 'output');

  for (let i = 1; i < args.length; i++) {
    const flag = args[i];
    const value = args[i + 1];

    if (flag === '--theme' || flag === '-t') {
      if (!value || !VALID_THEMES.includes(value)) {
        console.error(`Error: Invalid theme "${value}". Valid: ${VALID_THEMES.join(', ')}`);
        process.exit(1);
      }
      theme = value;
      i++;
    } else if (flag === '--layout' || flag === '-l') {
      if (!value || !VALID_LAYOUTS.includes(value)) {
        console.error(`Error: Invalid layout "${value}". Valid: ${VALID_LAYOUTS.join(', ')}`);
        process.exit(1);
      }
      layout = value;
      i++;
    } else if (flag === '--output' || flag === '-o') {
      if (!value) {
        console.error('Error: --output requires a directory path.');
        process.exit(1);
      }
      outputDir = path.resolve(value);
      i++;
    }
  }

  return { menus, theme, layout, outputDir };
}

function printUsage() {
  console.log(`
Usage: node scripts/generate-pdf.js <menu> [options]

Menu types:
  wall        Export wall menu (1250×600mm landscape)
  a4          Export A4 menu (210×297mm portrait)
  all         Export both menus

Options:
  --theme, -t <name>    Theme: ${VALID_THEMES.join(', ')} (default: default)
  --layout, -l <name>   Layout: ${VALID_LAYOUTS.join(', ')} (default: a)
  --output, -o <dir>    Output directory (default: ./output)
  --help, -h            Show this help

Examples:
  node scripts/generate-pdf.js wall
  node scripts/generate-pdf.js a4 --theme cny --layout b
  node scripts/generate-pdf.js all --output ./pdfs
`);
}

/* ═══════════════════════════════════
   Static File Server
═══════════════════════════════════ */

function createStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.join(PROJECT_ROOT, urlPath === '/' ? 'index.html' : urlPath);

      const normalizedFilePath = path.normalize(filePath);
      if (!normalizedFilePath.startsWith(PROJECT_ROOT)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      fs.readFile(normalizedFilePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }

        const ext = path.extname(normalizedFilePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });

    server.on('error', reject);
  });
}

/* ═══════════════════════════════════
   PDF Generation
═══════════════════════════════════ */

async function generatePdf({ port, menuKey, theme, layout, outputDir }) {
  const config = MENU_CONFIG[menuKey];
  const url = `http://127.0.0.1:${port}/${config.file}`;
  const outputFile = path.join(outputDir, `${menuKey}-${theme}-${layout}.pdf`);

  console.log(`  Generating ${config.label} (theme: ${theme}, layout: ${layout})...`);

  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    await page.setViewport(config.viewport);

    /* Set default page background to match --bg (#111111 = rgb(17,17,17))
       to eliminate the 1-2px white edge from Chromium's PDF renderer */
    const cdp = await page.createCDPSession();
    await cdp.send('Emulation.setDefaultBackgroundColorOverride', {
      color: { r: 17, g: 17, b: 17, a: 1 },
    });

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    await page.evaluate(
      ({ theme: t, layout: l }) => {
        if (window.MenuTheme) window.MenuTheme.apply(t);
        if (window.MenuLayout) window.MenuLayout.apply(l);
      },
      { theme, layout }
    );

    await new Promise((r) => setTimeout(r, 500));

    await page.pdf({
      path: outputFile,
      width: config.pdfSize.width,
      height: config.pdfSize.height,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    console.log(`  -> ${path.relative(PROJECT_ROOT, outputFile)}`);
  } finally {
    await browser.close();
  }
}

/* ═══════════════════════════════════
   Main
═══════════════════════════════════ */

async function main() {
  const { menus, theme, layout, outputDir } = parseArgs(process.argv);

  fs.mkdirSync(outputDir, { recursive: true });

  console.log('Starting local server...');
  const { server, port } = await createStaticServer();
  console.log(`Server running on http://127.0.0.1:${port}\n`);

  try {
    for (const menuKey of menus) {
      await generatePdf({ port, menuKey, theme, layout, outputDir });
    }
    console.log('\nDone!');
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error('PDF generation failed:', err.message);
  process.exit(1);
});

import fs from 'fs';
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[Browser Error] ${err.message}`));

  console.log('Navigating to http://localhost:5173/login ...');
  try {
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle', timeout: 5000 });
  } catch (e) {
    console.log('Navigation timeout or error:', e.message);
  }
  
  await browser.close();
})();

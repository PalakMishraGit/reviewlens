const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function capture() {
  const screenshotDir = path.resolve(__dirname, '../docs/screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,1050'],
    defaultViewport: { width: 1440, height: 1050 },
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // 1. Initial empty page or click "Load Official Benchmark"
  console.log('Clicking Load Official Benchmark button...');
  const sampleBtn = await page.waitForSelector('button::-p-text("Load Official Benchmark")');
  if (sampleBtn) {
    await sampleBtn.click();
  }

  // Wait for data to load and render
  await page.waitForSelector('section[aria-label="Executive KPI Summary"]', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Dashboard Overview Screenshot
  console.log('Capturing 01-dashboard-overview.png...');
  await page.screenshot({
    path: path.join(screenshotDir, '01-dashboard-overview.png'),
    fullPage: false,
  });

  // 2. Click "Draft Reply" button on the first review requiring a reply
  console.log('Opening Draft Reply modal...');
  const draftBtn = await page.waitForSelector('button::-p-text("Draft Reply")');
  if (draftBtn) {
    await draftBtn.click();
    // Wait for modal & textarea
    await page.waitForSelector('textarea', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 800));

    console.log('Capturing 02-ai-reply-generator.png...');
    await page.screenshot({
      path: path.join(screenshotDir, '02-ai-reply-generator.png'),
      fullPage: false,
    });

    // Close modal
    const closeBtn = await page.waitForSelector('button::-p-text("Close")');
    if (closeBtn) {
      await closeBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // 3. Switch to Product Analytics tab
  console.log('Switching to Product Insights Breakdown tab...');
  const productTab = await page.waitForSelector('button::-p-text("Product Insights Breakdown")');
  if (productTab) {
    await productTab.click();
    await new Promise(r => setTimeout(r, 800));

    console.log('Capturing 03-product-insights.png...');
    await page.screenshot({
      path: path.join(screenshotDir, '03-product-insights.png'),
      fullPage: false,
    });
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Screenshot error:', err);
  process.exit(1);
});

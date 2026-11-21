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

  // 1. Initial empty page or click "Load benchmark dataset"
  console.log('Clicking Load benchmark dataset button...');
  const sampleBtn = await page.waitForSelector('button::-p-text("Load benchmark dataset")');
  if (sampleBtn) {
    await sampleBtn.click();
  }

  // Wait for data to load and render
  await page.waitForSelector('section[aria-label="Executive KPI Summary"]', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Dashboard Overview Screenshot (Dark Theme)
  console.log('Capturing 01-dashboard-overview.png...');
  await page.screenshot({
    path: path.join(screenshotDir, '01-dashboard-overview.png'),
    fullPage: false,
  });

  // 2. Click "Draft reply" button on the first review requiring a reply
  console.log('Opening Draft reply modal...');
  const draftBtn = await page.waitForSelector('button::-p-text("Draft reply")');
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
  console.log('Switching to Product analytics tab...');
  const productTab = await page.waitForSelector('[data-testid="tab-products"]');
  if (productTab) {
    await productTab.click();
    await new Promise(r => setTimeout(r, 800));

    console.log('Capturing 03-product-insights.png...');
    await page.screenshot({
      path: path.join(screenshotDir, '03-product-insights.png'),
      fullPage: false,
    });
  }

  // 4. Switch back to Reviews table and expand R012 (Adversarial Prompt Injection)
  console.log('Switching back to Reviews table and inspecting row R012...');
  const reviewsTab = await page.waitForSelector('[data-testid="tab-reviews"]');
  if (reviewsTab) {
    await reviewsTab.click();
    await new Promise(r => setTimeout(r, 600));

    // Scroll table into view and click row R012
    const r012Row = await page.waitForSelector('[data-testid="review-row-R012"]');
    if (r012Row) {
      await page.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }), r012Row);
      await new Promise(r => setTimeout(r, 500));
      await r012Row.click();
      await new Promise(r => setTimeout(r, 800));

      console.log('Capturing 04-review-drawer-inspector.png...');
      await page.screenshot({
        path: path.join(screenshotDir, '04-review-drawer-inspector.png'),
        fullPage: false,
      });
    }
  }

  // 5. Open Shortcuts & Architectural Guide Modal
  console.log('Opening Shortcuts modal (Pressing ?)...');
  await page.keyboard.press('?');
  await new Promise(r => setTimeout(r, 600));

  console.log('Capturing 05-shortcuts-modal.png...');
  await page.screenshot({
    path: path.join(screenshotDir, '05-shortcuts-modal.png'),
    fullPage: false,
  });

  // Close modal
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // 6. Toggle Light Theme Mode
  console.log('Toggling Light Theme Mode (Pressing T)...');
  await page.keyboard.press('t');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 800));

  console.log('Capturing 06-dashboard-light-theme.png...');
  await page.screenshot({
    path: path.join(screenshotDir, '06-dashboard-light-theme.png'),
    fullPage: false,
  });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Screenshot error:', err);
  process.exit(1);
});

const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');

// WORKAROUND: Set HOME to temp dir to avoid "no HOME env" error
process.env.HOME = os.tmpdir();
console.log(`Set HOME to: ${process.env.HOME}`);

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set viewport to a standard desktop resolution
        await page.setViewport({ width: 1280, height: 800 });

        console.log('Navigating to http://localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });

        console.log('Page loaded. Taking screenshot...');
        const screenshotPath = path.resolve(__dirname, 'homepage.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });

        console.log(`Screenshot saved to: ${screenshotPath}`);
        await browser.close();
    } catch (error) {
        console.error('Error during verification:', error);
        process.exit(1);
    }
})();

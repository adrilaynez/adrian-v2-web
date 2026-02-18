const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');

process.env.HOME = os.tmpdir();

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    async function takeScreenshot(name) {
        const filePath = path.resolve(__dirname, `${name}.png`);
        // Wait a bit for animations
        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: filePath, fullPage: true });
        console.log(`📸 Screenshot saved: ${name}`);
    }

    try {
        console.log('🚀 Starting User Journey Test...');

        // 1. Home
        console.log('1. Navigating to Home...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
        await takeScreenshot('step1-home-v2');

        // Check Hero
        const bodyText = await page.$eval('body', el => el.innerText);
        if (!bodyText.includes('ADRIAN LAYNEZ')) throw new Error('New design not loaded');
        console.log('   - Adrian Laynez branding verified.');

        // 2. Click "Read Research" (using href selector)
        console.log('2. Clicking "Read Research"...');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('a[href="/notes"]')
        ]);
        await takeScreenshot('step2-notes-page');
        console.log(`   - Navigated to: ${page.url()}`);

        // 3. Click first article
        console.log('3. Clicking first article...');
        // Select the first link that points to a specific note
        try {
            await page.waitForSelector('a[href^="/notes/"]', { timeout: 5000 });
        } catch (e) {
            throw new Error('No note links found on the page');
        }

        const articleLinks = await page.$$('a[href^="/notes/"]');
        // Filter out links that might just be "/notes" (though href^="/notes/" handles that if it's strictly subpaths, but just to be safe)
        // Actually the href will be absolute or relative. generic match is fine.
        if (articleLinks.length === 0) throw new Error('No articles found!');

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            articleLinks[0].click()
        ]);
        await takeScreenshot('step3-article-read');
        console.log(`   - Reading article at: ${page.url()}`);

        // 4. Check Code Blocks
        const codeBlocks = await page.$$('pre');
        if (codeBlocks.length > 0) {
            console.log(`   - Verified ${codeBlocks.length} code blocks.`);
            await takeScreenshot('step4-code-visible');
        } else {
            console.log('   - No code blocks in this article (might be normal).');
        }

        // 5. Back Home
        console.log('5. Returning Home...');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('a[href="/"]') // Logo link
        ]);
        await takeScreenshot('step5-back-home');
        console.log('✅ User Journey Completed Successfully!');

    } catch (error) {
        console.error('❌ Test Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();

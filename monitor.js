const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const EMAIL = 'tako.chuang@gmail.com';
const PASSWORD = 'michaelchuang2020';
const LOGIN_URL = 'https://www.popmart.com/us/user/login';
const PRODUCT_URL = 'https://www.popmart.com/us/products/1683/THE-MONSTERS-COCA-COLA-Series-Figures';

async function tryAcceptCookies(page) {
    try {
        const cookieAcceptSelector = 'div.policy_acceptBtn__ZNU71';
        await page.waitForSelector(cookieAcceptSelector, { timeout: 5000 });
        await page.click(cookieAcceptSelector);
        console.log('🍪 Cookie consent clicked');
    } catch {
        console.log('🍪 No cookie banner found or already accepted');
    }
}

async function loginAndAddToBag() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();

    // Go to login page
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });
    await tryAcceptCookies(page);

    // Step 1: Enter email
    await page.waitForSelector('#email');
    await page.type('#email', EMAIL, { delay: 50 });

    // Click "Continue"
    await page.click('button.ant-btn.ant-btn-primary.index_loginButton__O6r8l');
    console.log('📩 Email submitted');

    // Step 2: Enter password
    await page.waitForSelector('#password');
    await page.type('#password', PASSWORD, { delay: 50 });

    // Click "Sign In"
    await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);
    console.log('🔐 Logged in');

    // Go to product page
    await page.goto(PRODUCT_URL, { waitUntil: 'networkidle2' });
    await tryAcceptCookies(page);

    // Try to click Add to Bag
    const addToBagSelector = 'div.index_usBtn__2KlEx.index_red__kx6Ql.index_btnFull__F7k90';
    const exists = await page.$(addToBagSelector);

    if (exists) {
        console.log('🛒 Add to Bag button found! Clicking...');
        await page.click(addToBagSelector);
    } else {
        console.log('❌ Add to Bag button not found.');
    }

    // Optional: Keep browser open
    // await browser.close();
}

loginAndAddToBag();

import puppeteer from 'puppeteer-core';

const test = async () => {
  console.log('🚀 Testing Puppeteer Launch...');
  try {
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true
    });
    console.log('✅ BROWSER LAUNCHED SUCCESSFULY!');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ BROWSER LAUNCH FAILED:', err.message);
    process.exit(1);
  }
};

test();

// import selenium functions
const {
  Builder, By, Key, until,
} = require('selenium-webdriver');

// this example will run the test on Firefox
// install and import chromedriver for Chrome
require('chromedriver');

// declare the -web- driver
let driver;

beforeAll(async () => {
  // initialize the driver before running the tests
  driver = await new Builder().forBrowser('chrome').build();
});

afterAll(async () => {
  // close the driver after running the tests
  await driver.quit();
});

// use the driver to mock user's actions
async function mockUserAction() {
  // open the URL
  driver.wait(until.urlIs('http://localhost:3000/messaging'));
  await driver.get('http://localhost:3000/messaging');
  const button = await driver.wait(until.elementLocated(By.id('msgModalBtn')), 10000);
  await button.click();
  const dstSelector = await driver.wait(until.elementLocated(By.id('text')), 10000);
  await dstSelector.sendKeys("Some Sample Text Here");
  const sendMsgButton = await driver.wait(until.elementLocated(By.id('sendMsgBtn')), 10000);
  await sendMsgButton.click();  // return the element contining the value to test
  return driver.wait(until.elementLocated(By.id('sentMessages')), 10000);
}

it('test webpage updated correctly', async () => {
  // call the mock function
  const element = await mockUserAction();
  // retrieve the content of the element
  // test the values
  expect(element).not.toBeNull();
});
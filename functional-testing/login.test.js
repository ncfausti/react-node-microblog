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
  driver.wait(until.urlIs('http://localhost:3000'));
  await driver.get('http://localhost:3000');
  const username = await driver.wait(until.elementLocated(By.id('username')), 10000);
  await username.sendKeys("feng3116");
  const password = await driver.wait(until.elementLocated(By.id('password')), 10000);
  await password.sendKeys("1234");
  const submit = await driver.wait(until.elementLocated(By.id('submit')), 10000);
  await submit.click();  // return the element contining the value to test
  return driver.wait(until.elementLocated(By.id('home-root')), 10000);
}

it('test webpage updated correctly', async () => {
  // call the mock function
  const element = await mockUserAction();
  // retrieve the content of the element
  // test the values
  expect(element).not.toBeNull();
});
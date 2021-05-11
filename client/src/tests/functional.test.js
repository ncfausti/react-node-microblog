/* eslint-disable no-undef */
const {
  Builder, By, Key, until,
} = require('selenium-webdriver');
require('geckodriver');

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser('firefox').build();
});

afterAll(async () => {
  await driver.quit();
});

async function mockPost() {
  driver.wait(until.urlIs('http://localhost:3000/home'));
  await driver.get('http://localhost:3000/home');

  const textbox = await driver.wait(until.elementLocated(By.id('city')), 10000);

  await textbox.sendKeys('New York', Key.RETURN);
  await driver.findElement(By.id('btn')).click();

  const results = await driver.wait(until.elementsLocated(By.className('result')), 10000);
  return results[results.length - 1];
}

test('webpage updated correctly after city submitted', async () => {
  const result = await mockPost();

  const returnedText = await result.findElement(By.className('text')).getText();
  const returnedImg = await result.findElement(By.css('img')).getAttribute('src');

  expect(returnedText).not.toBeNull();
  expect(returnedText).toMatch(/New York*/);
  expect(returnedImg).not.toBeNull();
});

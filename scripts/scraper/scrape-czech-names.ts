#!/usr/bin/env ts-node

//import chalk from 'chalk';
import { writeFile } from 'fs/promises';
import { locateChrome } from 'locate-app';
import { join } from 'path';
import puppeteer from 'puppeteer-core';
import { forTime } from 'waitasecond';

main();

const allNames: Array<{ name: string; count: number }> = [];
async function pushNames(...newNames: Array<{ name: string; count: number }>) {
    for (const newName of newNames) {
        if (!allNames.some((name) => name.name === newName.name)) {
            allNames.push(newName);
        }
    }

    await writeFile(join(__dirname, '../../data/czech-last-names.json'), JSON.stringify(allNames, null, 4), 'utf8');
}

async function main() {
    //console.info(chalk.bgGrey(` Scraping Czech names`));

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: await locateChrome(),
        defaultViewport: null,
        // args: ['--proxy-server=socks5://127.0.0.1:9050']
    });

    browser.on('disconnected', () => {
        console.log('Browser disconnected');
        process.exit(1);
    });

    await (await browser.pages())[0].goto(`https://api.ipify.org/`, { waitUntil: 'networkidle2' });

    const page = await browser.newPage();

    let pageNumber = 1;
    while (true) {
        await page.goto(`https://www.prijmeni.cz/oblast/3000-ceska_republika&page=${pageNumber++}`, {
            waitUntil: 'load',
        });
        await page.click('#didomi-notice-agree-button' /* Note: EU Cookies */).catch(() => {});

        await pushNames(
            ...(await page.evaluate(async () => {
                const names: Array<{ name: string; count: number }> = [];
                for (const element of Array.from(document.querySelectorAll('.itemprijmeni'))) {
                    const [orderElement, nameElement, countElement] = Array.from(element.querySelectorAll('td'));
                    names.push({ name: nameElement.innerText, count: parseInt(countElement.innerText) });
                }
                return names;
            })),
        );

        await forTime(1000);
    }
}

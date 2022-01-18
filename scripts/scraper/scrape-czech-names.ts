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


/**
 * TODO: When scraping czech names, after a long while occured recurring error:
 >
 > (node:18072) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 82)
 > (node:18072) UnhandledPromiseRejectionWarning: ProtocolError: Protocol error (Page.createIsolatedWorld): No frame for given id found
 >     at C:\Users\me\work\collboard\random-arts\node_modules\puppeteer-core\src\common\Connection.ts:300:16
 >     at new Promise (<anonymous>)
 >     at CDPSession.send (C:\Users\me\work\collboard\random-arts\node_modules\puppeteer-core\src\common\Connection.ts:296:12)
 >     at C:\Users\me\work\collboard\random-arts\node_modules\puppeteer-core\src\common\FrameManager.ts:396:19
 >     at Array.map (<anonymous>)
 >     at FrameManager._ensureIsolatedWorld (C:\Users\me\work\collboard\random-arts\node_modules\puppeteer-core\src\common\FrameManager.ts:395:10)
 >     at runMicrotasks (<anonymous>)
 >     at processTicksAndRejections (internal/process/task_queues.js:93:5)
 >     at async Promise.all (index 1)
 >     at FrameManager.initialize (C:\Users\me\work\collboard\random-arts\node_modules\puppeteer-core\src\common\FrameManager.ts:142:7)
 > (node:18072) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 83)
 > (node:18072) UnhandledPromiseRejectionWarning: TimeoutError: Navigation timeout of 30000 ms exceeded
 >     at C:\Users\me\work\collboard\random-arts\node_modules\puppeteer-core\src\common\LifecycleWatcher.ts:205:18
 > (node:18072) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 84)
 >
 */
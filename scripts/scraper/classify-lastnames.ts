#!/usr/bin/env ts-node

//import chalk from 'chalk';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { IName } from './IName';

main();

async function main() {
    console.info(` Classifying lastnames`);

    const maleNames: IName[] = [];
    const femaleNames: IName[] = [];

    const lastNames = JSON.parse(await readFile(join(__dirname, `../../data/czech-last-names.json`), 'utf8'));

    for (const name of lastNames) {
        if (/á$/i.test(name.name)) {
            femaleNames.push(name);
        } else {
            maleNames.push(name);
        }
    }

    await writeFile(
        join(__dirname, `../../data/czech-last-male-names.json`),
        JSON.stringify(maleNames, null, 4),
        'utf8',
    );
    await writeFile(
        join(__dirname, `../../data/czech-last-female-names.json`),
        JSON.stringify(femaleNames, null, 4),
        'utf8',
    );
}

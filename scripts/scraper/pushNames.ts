import { writeFile } from 'fs/promises';
import { join } from 'path';
import { IName } from './IName';

export async function pushNames(fileName: string, allNames: IName[], ...newNames: IName[]) {
    for (const newName of newNames) {
        if (!allNames.some((name) => name.name === newName.name)) {
            allNames.push(newName);
        }
    }

    await writeFile(join(__dirname, `../../data/${fileName}.json`), JSON.stringify(allNames, null, 4), 'utf8');
}

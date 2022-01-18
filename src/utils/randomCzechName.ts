import { randomItem } from '@collboard/modules-sdk';
import czechFirstMaleNames from '../../data/czech-first-male-names.json';
import czechLastNames from '../../data/czech-last-names.json';
import { IName } from '../../scripts/scraper/IName';

export interface IRandomCzechNameOptions {
    includeFirstName: boolean;
    includeLastName: boolean;
}

export function randomCzechName({ includeFirstName, includeLastName }: IRandomCzechNameOptions): string {
    const firstName = randomItem<IName>(...czechFirstMaleNames);
    const lastName = randomItem<IName>(...czechLastNames);

    console.log({ firstName, lastName });

    return [firstName.name, lastName.name].join(' ');
}

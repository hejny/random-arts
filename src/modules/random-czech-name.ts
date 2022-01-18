import { declareModule, TextArt } from '@collboard/modules-sdk';
import { Vector } from 'xyzt';
import { contributors, description, license, repository, version } from '../../package.json';
import { makeRandomItemToolModule } from '../makers/makeRandomItemToolModule';
import { randomCzechName } from '../utils/randomCzechName';

declareModule(
    makeRandomItemToolModule({
        manifest: {
            name: '@hejny/random-czech-name',
            // Note: This module is only in Czech language
            title: { cs: 'Náhodné české jméno a příjmení' },
            categories: ['Fun', 'Czech'],
            keywords: ['random', 'czech', 'name', 'surname', 'firstname'],
            icon: '🧑‍🤝‍🧑',
            contributors,
            description,
            license,
            repository,
            version,
        },

        placeFrequency: 0.07,
        getRandomArt(pointOnBoard: Vector) {
            const art = new TextArt(
                randomCzechName({ includeFirstName: true, includeLastName: true }),
                'black',
                24,
                false,
                false,
                false,
                'none',
                Vector.zero(),
                // TODO: Center> new Vector(fontSize * (2 / 3), fontSize * (2 / 3)),
            );
            art.shift = pointOnBoard; // TODO: Center>.subtract(new Vector(fontSize * (2 / 3), fontSize * (2 / 3)));

            return art;
        },
    }),
);

/**
 * TODO: Pick standart font size and color
 * TODO: Toggle name + surname
 * TODO: Toggle gender
 * TODO: Disclaimer
 * TODO: Text cursor
 */

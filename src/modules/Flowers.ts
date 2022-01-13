import { declareModule } from '@collboard/modules-sdk';
import { makeEmojisToolModule } from '../makers/makeRandomTextToolModule';
import { contributors, description, license, repository, version } from '../package.json';

declareModule(
    makeEmojisToolModule({
        manifest: {
          name: '@hejny/random-flower-emoji',
            deprecatedNames: ['FlowersEmojis'],
            title: { en: 'Drawing of flowers', cs: 'Kreslení květin' },
            categories: ['Emojis', 'Fun'],
            icon: '🥀',
            contributors,
            description,
            license,
            repository,
            version,
        },
        fontSizeRange: { min: 15, max: 80 },
        placeFrequency: 0.07,
        emojis: ['🥀', '💮', '🌼', '💐', '🌻', '🌺', '🌹', '🌸', '🌷', '💠', '🏵️', '🌵', '⚜️'],
    }),
);

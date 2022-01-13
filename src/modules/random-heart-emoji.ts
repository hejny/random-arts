import { declareModule } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../../package.json';
import { makeRandomTextToolModule } from '../makers/makeRandomTextToolModule';

declareModule(
    makeRandomTextToolModule({
        manifest: {
            name: '@hejny/random-heart-emoji',
            deprecatedNames: ['HeartsEmojis'],
            title: { en: 'Drawing of hearts', cs: 'Kreslení srdcí' },
            categories: ['Emojis', 'Fun'],
            icon: '❤️',
            contributors,
            description,
            license,
            repository,
            version,
        },
        fontSizeRange: { min: 15, max: 80 },
        placeFrequency: 0.07,
        items: ['❤️', '❤', '💕', '💖', '💗', '💜', '💚', '🧡', '💓', '💛', '💘'],
    }),
);

import { declareModule, makeIconModuleOnModule } from '@collboard/modules-sdk';
import { contributors, description, license, repository, version } from '../package.json';

declareModule(
  makeIconModuleOnModule({
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
        emojis: ['❤️', '❤', '💕', '💖', '💗', '💜', '💚', '🧡', '💓', '💛', '💘'],


        toolbar: ToolbarName.Tools,
        icon: {
            order: 10,

            char: manifest.icon,
            boardCursor: 'crosshair',
        },

        moduleActivatedByIcon: {
            async setup(systems) {
                const { touchController, collSpace, materialArtVersioningSystem } = await systems.request(
                    'touchController',
                    'collSpace',
                    'materialArtVersioningSystem',
                );
                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe({
                        next: (touch) => {
                            const operation = materialArtVersioningSystem.createPrimaryOperation();

                            const drawEmoji = (position: Vector) => {
                                // TODO: Instead of drawEmoji function there should be inficator in touch.frames.subscribe that it is forst frame (some frame index on the object TouchFrame)

                                const fontSize =
                                    Math.random() * (fontSizeRange.max - fontSizeRange.min) + fontSizeRange.min;

                                const art = new TextArt(
                                    randomItem(...emojis),
                                    'red' /* TODO: Better */,
                                    fontSize,
                                    false,
                                    false,
                                    false,
                                    'none',
                                    Vector.zero(),
                                );
                                art.shift = collSpace.pickPoint(
                                    position.subtract(new Vector(fontSize * (2 / 3), fontSize * (2 / 3))),
                                ).point;

                                operation.newArts(art).persist();
                            };

                            drawEmoji(Vector.fromObject(touch.firstFrame.position));

                            registerAdditionalSubscription(
                                touch.frames.subscribe({
                                    next: (touchFrame) => {
                                        if (Math.random() > placeFrequency) return;
                                        drawEmoji(Vector.fromObject(touchFrame.position));
                                    },
                                }),
                            );
                        },
                    }),
                );
            },



    }),
);






import {
    declareModule,
    IFontStyleAttributeValue,
    makeIconModuleOnModule,
    React,
    TextArt,
    ToolbarName,
} from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { contributors, description, license, repository, version } from '../../../package.json';
import { IRandomCzechNameOptions } from './IRandomCzechNameOptions';
import { randomCzechName } from './randomCzechName';
import { RandomCzechNameMenu } from './RandomCzechNameMenu';

declareModule(() => {
    let options: IRandomCzechNameOptions = {
        isProportionallyRandom: true,
        hasFirstName: true,
        hasLastName: true,
    };

    return makeIconModuleOnModule({
        manifest: {
            name: '@hejny/random-czech-name',
            // Note: This module is only in Czech language
            // TODO: Make this module visible only in czech language
            title: { cs: 'Náhodné české jméno a příjmení' },
            categories: ['Fun', 'Czech'],
            keywords: ['random', 'czech', 'name', 'surname', 'firstname'],

            // TODO: Repair icon in modules store
            icon: '🧑‍🤝‍🧑',
            contributors,
            description,
            license,
            repository,
            version,
        },
        toolbar: ToolbarName.Tools,
        icon: (systems) => ({
            order: 10,
            icon: '🧑‍🤝‍🧑',
            boardCursor: 'text',
            async menu() {
                return (
                    <RandomCzechNameMenu
                        {...await systems.request('attributesSystem')}
                        {...{
                            options,
                            setOptions(newOptions: IRandomCzechNameOptions) {
                                options = newOptions;
                            },
                        }}
                    />
                );
            },
        }),

        moduleActivatedByIcon: {
            async setup(systems) {
                const {
                    touchController,
                    collSpace,
                    materialArtVersioningSystem,
                    attributesSystem,
                    // storageSystem,
                    // notificationSystem,
                } = await systems.request(
                    'touchController',
                    'collSpace',
                    'materialArtVersioningSystem',
                    'attributesSystem',
                    // 'storageSystem',
                    // 'notificationSystem',
                );

                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe({
                        async next(touch) {
                            // console.log(options);

                            materialArtVersioningSystem
                                .createPrimaryOperation()
                                .newArts(
                                    new TextArt(
                                        randomCzechName(options),
                                        attributesSystem.getAttributeValue('color') as string,
                                        attributesSystem.getAttributeValue('fontSize') as number,
                                        (
                                            attributesSystem.getAttributeValue('fontStyle') as IFontStyleAttributeValue
                                        ).bold,
                                        (
                                            attributesSystem.getAttributeValue('fontStyle') as IFontStyleAttributeValue
                                        ).italic,
                                        (
                                            attributesSystem.getAttributeValue('fontStyle') as IFontStyleAttributeValue
                                        ).underline,
                                        /*(attributesSystem.getAttributeValue('listStyle') as string) as listStyle*/ 'none',
                                        collSpace.pickPoint(touch.firstFrame.position).point,
                                    ),
                                )
                                .persist();

                            /*
                            > TODO: There should be some easy way to do notification with memory - keeping it for the future

                            const storage = storageSystem.getStorage<boolean>(
                                '@hejny/random-czech-name' /* TODO: There should be no need to scope manually * /,
                            );
                            if (!(await storage.getItem('readDisclaimer'))) {
                                notificationSystem.publish({
                                    type: 'info',
                                    tag: `random-czech-name-disclaimer`,
                                    title: { en: 'Disclaimer', cs: 'Poznámka' },
                                    body: { en: 'Disclaimer', cs: 'Poznámka' },
                                    canBeClosed: true,
                                    onClose: async () => {

                                    }
                                });
                            }
                            */
                        },
                    }),
                );
            },
        },
    });
});

/**
 * TODO: Disclaimer
 */

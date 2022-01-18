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
        // TODO: pickGender: Gende,
        isProportionallyRandom: true,
        hasFirstName: true,
        hasLastName: true,
    };

    return makeIconModuleOnModule({
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
        toolbar: ToolbarName.Tools,
        icon: (systems) => ({
            order: 10,
            char: '🧑‍🤝‍🧑',
            boardCursor: 'crosshair',
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
                const { touchController, collSpace, materialArtVersioningSystem, attributesSystem } =
                    await systems.request(
                        'touchController',
                        'collSpace',
                        'materialArtVersioningSystem',
                        'attributesSystem',
                    );

                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe({
                        next(touch) {
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
                        },
                    }),
                );
            },
        },
    });
});

/**
 * TODO: Toggle name + surname
 * TODO: Toggle gender
 * TODO: Disclaimer
 * TODO: Text cursor
 * TODO: Use useState as state
 */

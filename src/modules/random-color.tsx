import { declareModule, FreehandArt, makeIconModuleOnModule, ToolbarName } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import * as React from 'react';
import { contributors, description, license, repository, version } from '../../package.json';
import { randomColor } from '../utils/randomColor';

declareModule(
    makeIconModuleOnModule({
        manifest: {
            name: '@hejny/random-color',
            title: { en: 'Drawing of random colors', cs: 'Kreslení náhodných barev' },
            categories: ['Emojis', 'Fun'],
            icon: '🎨',
            contributors,
            description,
            license,
            repository,
            version,
        },
        toolbar: ToolbarName.Tools,
        async icon(systems) {
            const { attributesSystem } = await systems.request('attributesSystem');
            return {
                autoSelect: true,
                order: 10,
                char: '🎨',
                boardCursor: 'crosshair',
                menu: <>{attributesSystem.inputRender('weight')}</>,
            };
        },
        moduleActivatedByIcon: {
            async setup(systems) {
                const { touchController, collSpace, appState, attributesSystem, materialArtVersioningSystem } =
                    await systems.request(
                        'touchController',
                        'collSpace',
                        'appState',
                        'attributesSystem',
                        'materialArtVersioningSystem',
                    );
                return Registration.fromSubscription((registerAdditionalSubscription) =>
                    touchController.touches.subscribe((touch) => {
                        appState.cancelSelection();

                        const artInProcess = new FreehandArt(
                            [],
                            randomColor(),
                            attributesSystem.getAttributeValue('weight') as number,
                        );

                        const operation = materialArtVersioningSystem.createPrimaryOperation();
                        operation.newArts(artInProcess);

                        registerAdditionalSubscription(
                            touch.frames.subscribe(
                                // TODO: There should be some predetermined order which subscriber (freehand,move,...) to call first which second... and it should be determined by module priority NOT installation (subscription) order
                                (touchFrame) => {
                                    touchFrame.position = collSpace.pickPoint(touchFrame.position).point;
                                    artInProcess.frames.push(touchFrame);
                                    operation.update(artInProcess);
                                },
                                () => {},
                                () => {
                                    operation.persist();
                                },
                            ),
                        );
                    }),
                );
            },
        },
    }),
);

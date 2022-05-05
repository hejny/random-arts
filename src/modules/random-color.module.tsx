import { declareModule, FreehandArt, makeIconModuleOnModule, React, ToolbarName } from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { contributors, description, license, repository, version } from '../../package.json';
import { randomColor } from '../utils/randomColor';

declareModule(
    makeIconModuleOnModule({
        manifest: {
            name: '@hejny/random-color',
            title: { en: 'Drawing of random colors', cs: 'Kreslení náhodných barev' },
            categories: ['Art', 'Fun'],
            keywords: ['random', 'color', 'drawing', 'freehand', 'fun', 'rainbow'],
            icon: '🌈',
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
                icon: '🎨',
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
                            touch.frames.subscribe({
                                // TODO: There should be some predetermined order which subscriber (freehand,move,...) to call first which second... and it should be determined by module priority NOT installation (subscription) order
                                next(touchFrame) {
                                    touchFrame.position = collSpace.pickPoint(touchFrame.position).point;
                                    artInProcess.frames.push(touchFrame);
                                    operation.update(artInProcess);
                                },
                                complete() {
                                    operation.persist();
                                },
                            }),
                        );
                    }),
                );
            },
        },
    }),
);

/**
 * TODO: There is a strange warning:
 *
 * ERROR  Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
 *     [x]  1. You might have mismatching versions of React and the renderer (such as React DOM)
 *     [ ]  2. You might be breaking the Rules of Hooks
 *   ->[ ]  3. You might have more than one copy of React in the same app
 *     [ ]  See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.
 *
 *
 */

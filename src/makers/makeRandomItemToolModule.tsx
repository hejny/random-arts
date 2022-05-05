import {
    AbstractArt,
    IModuleDefinition,
    IModuleManifest,
    makeIconModuleOnModule,
    ToolbarName,
} from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { Promisable } from 'type-fest';
import { Vector } from 'xyzt';

export function makeRandomItemToolModule(protoModule: {
    manifest: IModuleManifest;
    placeFrequency: number;
    getRandomArt(pointOnBoard: Vector): Promisable<AbstractArt>;
}): IModuleDefinition {
    const { manifest, placeFrequency, getRandomArt } = protoModule;

    return makeIconModuleOnModule({
        // TODO: Maybe help with the manifest
        manifest,
        toolbar: ToolbarName.Tools,
        icon: {
            order: 10,
            icon: manifest.icon!,
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
                        next(touch) {
                            const operation = materialArtVersioningSystem.createPrimaryOperation();

                            async function drawRandomArt(pointOnScreen: Vector) {
                                operation
                                    .newArts(await getRandomArt(collSpace.pickPoint(pointOnScreen).point))
                                    .persist();
                            }

                            drawRandomArt(Vector.fromObject(touch.firstFrame.position));

                            registerAdditionalSubscription(
                                touch.frames.subscribe({
                                    next: (touchFrame) => {
                                        if (Math.random() > placeFrequency) return;
                                        drawRandomArt(Vector.fromObject(touchFrame.position));
                                    },
                                }),
                            );
                        },
                    }),
                );
            },
        },
    });
}

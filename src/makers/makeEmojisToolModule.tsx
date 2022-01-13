import {
    IModuleDefinition,
    IModuleManifest,
    makeIconModuleOnModule,
    randomItem,
    TextArt,
    ToolbarName,
} from '@collboard/modules-sdk';
import { Registration } from 'destroyable';
import { Vector } from 'xyzt';

/**
 * Makes toolbar icon module which setup/unsetup given submodule when user select/unselect icon
 * TODO: Probbably better name (makeIconModuleOnModule vs. makeIconModuleOnRoute)
 *
 */
export function makeEmojisToolModule(protoModule: {
    manifest: IModuleManifest;
    fontSizeRange: { min: number; max: number } /* TODO: Interface for range */;
    placeFrequency: number;
    emojis: string[];
}): IModuleDefinition {
    const { manifest, fontSizeRange, placeFrequency, emojis } = protoModule;

    return makeIconModuleOnModule({
        // TODO: Maybe help with the manifest
        manifest,
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
        },
    });
}

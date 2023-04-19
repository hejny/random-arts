import { Arrayable, IModuleDefinition, IModuleManifest, randomItem, TextArt, toArray } from '@collboard/modules-sdk';
import { Vector } from 'xyzt';
import { makeRandomItemToolModule } from './makeRandomItemToolModule';

export function makeRandomTextToolModule(protoModule: {
    manifest: IModuleManifest;
    fontSizeRange: { min: number; max: number } /* TODO: Interface for range */;
    placeFrequency: number;
    items: Arrayable<string>;
}): IModuleDefinition {
    const { fontSizeRange, items } = protoModule;

    return makeRandomItemToolModule({
        ...protoModule,

        getRandomArt(pointOnBoard: Vector) {
            const fontSize = Math.random() * (fontSizeRange.max - fontSizeRange.min) + fontSizeRange.min;

            const art = new TextArt(
                randomItem(...toArray(items)),
                '#777',
                fontSize,
                false,
                false,
                false,
                'none',
            ).setShift(
                pointOnBoard, // TODO: Remove: .subtract(new Vector(fontSize * (2 / 3), fontSize * (2 / 3))).
            );

            return art;
        },
    });
}

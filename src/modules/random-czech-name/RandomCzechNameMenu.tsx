import { AttributesSystem, Icon, React, Separator } from '@collboard/modules-sdk';
import { IRandomCzechNameOptions } from './IRandomCzechNameOptions';
import { Gender } from './randomCzechName';
import './style.css';

interface IRandomCzechNameMenuProps {
    attributesSystem: AttributesSystem;
    options: IRandomCzechNameOptions;
    setOptions(newOptions: IRandomCzechNameOptions): void;
}

export function RandomCzechNameMenu({
    attributesSystem,
    options: optionsExternal,
    setOptions: setOptionsExternal,
}: IRandomCzechNameMenuProps) {
    // Note: Is it better to have one combinated state or multiple microstates?
    const [options, setOptionsInternal] = React.useState<IRandomCzechNameOptions>(optionsExternal);
    const setOptions = (newPartialOptions: Partial<IRandomCzechNameOptions>) => {
        const newOptions = { ...options, ...newPartialOptions };
        setOptionsInternal(newOptions);
        setOptionsExternal(newOptions);
    };

    return (
        <>
            {attributesSystem.inputRender('fontStyle')}
            <Separator />
            {attributesSystem.inputRender('fontSize')}
            <Separator />
            {attributesSystem.inputRender('color')}
            <Separator />
            <Icon
                char="⭐"
                active={options.isProportionallyRandom}
                onClick={() => setOptions({ isProportionallyRandom: !options.isProportionallyRandom })}
                // TODO: Title with explanation
            />
            <Separator />

            <Icon
                char="Jan"
                className="stretched-icon-for-jan"
                active={options.hasFirstName && !options.hasLastName}
                onClick={() => setOptions({ hasFirstName: true, hasLastName: false })}
            />

            <Icon
                char="Jan Novák"
                className="stretched-icon-for-jan-novak"
                active={options.hasFirstName && options.hasLastName}
                onClick={() => setOptions({ hasFirstName: true, hasLastName: true })}
            />

            <Icon
                char="Novák"
                className="stretched-icon-for-novak"
                active={!options.hasFirstName && options.hasLastName}
                onClick={() => setOptions({ hasFirstName: false, hasLastName: true })}
            />
            <Separator />
            <Icon
                char="🙋‍♂️"
                active={options.pickGender === Gender.Male}
                onClick={() => setOptions({ pickGender: Gender.Male })}
            />
            <Icon
                char="🧑‍🤝‍🧑"
                active={options.pickGender === undefined}
                onClick={() => setOptions({ pickGender: undefined })}
            />
            <Icon
                char="🙋‍♀️"
                active={options.pickGender === Gender.Female}
                onClick={() => setOptions({ pickGender: Gender.Female })}
            />
        </>
    );
}

/**
 * TODO: !!! Options are strangely not preserved
 * TODO: some prettier way how to combine internal and external state
 */

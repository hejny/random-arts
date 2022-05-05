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

    const gender: Gender = options.pickGender || Gender.Female; /*randomItem(Gender.Female, Gender.Male)*/

    return (
        <>
            {attributesSystem.inputRender('fontStyle')}
            <Separator />
            {attributesSystem.inputRender('fontSize')}
            <Separator />
            {attributesSystem.inputRender('color')}
            <Separator />
            <Icon
                icon="⭐"
                active={options.isProportionallyRandom}
                onClick={() => setOptions({ isProportionallyRandom: !options.isProportionallyRandom })}
                // TODO: Title with explanation
            />
            <Separator />

            <Icon
                icon={{ [Gender.Male]: 'Jan', [Gender.Female]: 'Jana' }[gender]}
                className="stretched-icon-for-jana"
                active={options.hasFirstName && !options.hasLastName}
                onClick={() => setOptions({ hasFirstName: true, hasLastName: false })}
            />

            <Icon
                icon={{ [Gender.Male]: 'Jan Novák', [Gender.Female]: 'Jana Nováková' }[gender]}
                className="stretched-icon-for-jana-novak"
                active={options.hasFirstName && options.hasLastName}
                onClick={() => setOptions({ hasFirstName: true, hasLastName: true })}
            />

            <Icon
                icon={{ [Gender.Male]: 'Novák', [Gender.Female]: 'Nováková' }[gender]}
                className="stretched-icon-for-novakova"
                active={!options.hasFirstName && options.hasLastName}
                onClick={() => setOptions({ hasFirstName: false, hasLastName: true })}
            />
            <Separator />
            <Icon
                icon="🙋‍♂️"
                active={options.pickGender === Gender.Male}
                onClick={() => setOptions({ pickGender: Gender.Male })}
            />
            <Icon
                icon="🧑‍🤝‍🧑"
                active={options.pickGender === undefined}
                onClick={() => setOptions({ pickGender: undefined })}
            />
            <Icon
                icon="🙋‍♀️"
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

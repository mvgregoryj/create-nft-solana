const capitalize = (word: string) => {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
};

export const toAttribute = (traitType: string) => (entry: string) => ({
    trait_type: traitType,
    value: entry,
});

export const toAttributes = (traitType: string, entries: string[]) =>
    entries.map(toAttribute(traitType));

export const attributes = (arrayAtributes: [string, any][]) => {
    const temp = arrayAtributes.filter(([key, _ ])=> {
        if (key !== 'name' && key !== 'description' && key !== 'image' && key !== 'website' && key !== 'tickets') {
            return true;
        } else {
            return false;
        }
    });

    return temp.reduce((result: {trait_type: string, value: string}[], [key, value])=> {
        if (typeof value === 'string') {
            result.push(toAttribute(`${capitalize(key)}`)(`${value}`));
        } else {
            result = [...result, ...toAttributes(capitalize(key), value)];
        }
        return result;
    }, []);
};
export const toAttribute = (traitType: string) => (entry: string) => ({
    trait_type: traitType,
    value: entry,
});

export const toAttributes = (traitType: string, entries: string[]) =>
    entries.map(toAttribute(traitType));

const getNftDescription = () =>
    'This NFT was originally minted during the Bogotá Party.';

function getArtists(artists: any) {
    const attributes = [];
    for (const artist of artists) {
        attributes.push({
            trait_type: 'Artist',
            value: artist,
        });
    }
    return attributes;
}

function getSponsors(sponsors: any) {
    const attributes = [];
    for (const sponsor of sponsors) {
        attributes.push({
            trait_type: 'Sponsor',
            value: sponsor,
        });
    }
    return attributes;
}

export {
    getNftDescription,
    getArtists,
    getSponsors
};


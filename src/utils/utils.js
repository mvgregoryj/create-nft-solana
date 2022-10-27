"use strict";
exports.__esModule = true;
exports.getSponsors = exports.getArtists = exports.getNftDescription = void 0;
var getNftDescription = function () {
    return 'This NFT was originally minted during the Bogotá Party.';
};
exports.getNftDescription = getNftDescription;
function getArtists(artists) {
    var attributes = [];
    for (var _i = 0, artists_1 = artists; _i < artists_1.length; _i++) {
        var artist = artists_1[_i];
        attributes.push({
            trait_type: 'Artist',
            value: artist
        });
    }
    return attributes;
}
exports.getArtists = getArtists;
function getSponsors(sponsors) {
    var attributes = [];
    for (var _i = 0, sponsors_1 = sponsors; _i < sponsors_1.length; _i++) {
        var sponsor = sponsors_1[_i];
        attributes.push({
            trait_type: 'Sponsor',
            value: sponsor
        });
    }
    return attributes;
}
exports.getSponsors = getSponsors;

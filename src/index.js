"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
/* eslint-disable indent */
var anchor_1 = require("@heavy-duty/anchor");
var js_1 = require("@metaplex-foundation/js");
var mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
var web3_js_1 = require("@solana/web3.js");
// import getNftDescription from utils.ts
var utils_1 = require("./utils/utils");
var main = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var description, keypair, connection, txhash, provider, metaplex, name_1, uri, nft_owner, _i, data_1, item, uri_1, usersVault, nft, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                description = (0, utils_1.getNftDescription)();
                keypair = web3_js_1.Keypair.generate();
                connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)('devnet'));
                return [4 /*yield*/, connection.requestAirdrop(keypair.publicKey, 1e9)];
            case 1:
                txhash = _c.sent();
                console.log("txhash: ".concat(txhash));
                provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(keypair), anchor_1.AnchorProvider.defaultOptions());
                metaplex = new js_1.Metaplex(connection)
                    .use((0, js_1.keypairIdentity)(keypair))
                    .use((0, js_1.bundlrStorage)());
                _c.label = 2;
            case 2:
                _c.trys.push([2, 11, , 12]);
                name_1 = 'Bogotá Party';
                return [4 /*yield*/, metaplex.nfts().uploadMetadata({
                        name: name_1,
                        description: description,
                        //image: process.env.COLLECTION_IMAGE_URL,
                        image: 'http://as01.epimg.net/img/comunes/fotos/fichas/equipos/large/3.png',
                        external_url: 'https://heavyduty.builders',
                        symbol: 'DEV',
                        attributes: [
                            {
                                trait_type: 'Location',
                                value: 'Bogotá, Colombia'
                            },
                            {
                                trait_type: 'Date',
                                value: 'OCT 25 2022'
                            },
                            {
                                trait_type: 'Made By',
                                value: 'Heavy Duty Builders'
                            },
                            {
                                trait_type: 'Powered By',
                                value: 'Solana University'
                            },
                        ]
                    })];
            case 3:
                uri = (_c.sent()).uri;
                return [4 /*yield*/, metaplex.nfts().create({
                        name: name_1,
                        sellerFeeBasisPoints: 0,
                        uri: uri
                    })];
            case 4:
                nft_owner = (_c.sent()).nft;
                _i = 0, data_1 = data;
                _c.label = 5;
            case 5:
                if (!(_i < data_1.length)) return [3 /*break*/, 10];
                item = data_1[_i];
                return [4 /*yield*/, metaplex.nfts().uploadMetadata({
                        name: name_1,
                        description: description,
                        //image: process.env.COLLECTION_IMAGE_URL,
                        image: 'http://as01.epimg.net/img/comunes/fotos/fichas/equipos/large/3.png',
                        external_url: "".concat(item.website),
                        symbol: 'DEV',
                        attributes: __spreadArray(__spreadArray([
                            {
                                trait_type: 'Ticket Number',
                                value: "".concat(item.ticket_number)
                            },
                            {
                                trait_type: 'Date',
                                value: "".concat(item.date)
                            },
                            {
                                trait_type: 'Location',
                                value: "".concat(item.location)
                            },
                            {
                                trait_type: 'Genre',
                                value: "".concat(item.genre)
                            }
                        ], (0, utils_1.getArtists)(item.artists), true), (0, utils_1.getSponsors)(item.sponsors), true)
                    })];
            case 6:
                uri_1 = (_c.sent()).uri;
                usersVault = new web3_js_1.PublicKey(item.wallet);
                return [4 /*yield*/, metaplex.nfts().create({
                        name: name_1,
                        sellerFeeBasisPoints: 0,
                        uri: uri_1,
                        collection: (_a = nft_owner.collection) === null || _a === void 0 ? void 0 : _a.address,
                        tokenOwner: usersVault
                    })];
            case 7:
                nft = (_c.sent()).nft;
                // Add the NFT to the user's wallet
                return [4 /*yield*/, provider.sendAndConfirm(new web3_js_1.Transaction().add((0, mpl_token_metadata_1.createSetAndVerifyCollectionInstruction)({
                        collectionMint: nft_owner.mint.address,
                        collection: (_b = nft_owner.collection) === null || _b === void 0 ? void 0 : _b.address,
                        collectionAuthority: provider.wallet.publicKey,
                        collectionMasterEditionAccount: nft_owner.address,
                        metadata: nft.metadataAddress,
                        payer: provider.wallet.publicKey,
                        updateAuthority: provider.wallet.publicKey
                    })))];
            case 8:
                // Add the NFT to the user's wallet
                _c.sent();
                _c.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 5];
            case 10:
                ;
                return [3 /*break*/, 12];
            case 11:
                error_1 = _c.sent();
                return [2 /*return*/, false];
            case 12: return [2 /*return*/, true];
        }
    });
}); };
var data = [
    {
        ticket_number: '1',
        date: 'NOV 4 2022',
        location: 'Bogotá, Colombia',
        genre: 'Rock',
        artists: ['The Rolling Stones', 'The Beatles'],
        sponsors: ['Heavy Duty Builders', 'Solana University'],
        website: 'https://heavyduty.builders',
        wallet: '75g5AdQBi4QZg53wQMdX4nvPQCWdUJ9dtV4keBS2RKmP'
    },
    {
        ticket_number: '2',
        date: 'NOV 4 2022',
        location: 'Bogotá, Colombia',
        genre: 'Pop',
        artists: ['The Rolling Stones', 'The Beatles'],
        sponsors: ['Heavy Duty Builders', 'Solana University'],
        website: 'https://heavyduty.builders',
        wallet: '75g5AdQBi4QZg53wQMdX4nvPQCWdUJ9dtV4keBS2RKmP'
    },
    {
        ticket_number: '3',
        date: 'NOV 4 2022',
        location: 'Bogotá, Colombia',
        genre: 'Dance',
        artists: ['The Rolling Stones', 'The Beatles'],
        sponsors: ['Heavy Duty Builders', 'Solana University'],
        website: 'https://heavyduty.builders',
        wallet: '75g5AdQBi4QZg53wQMdX4nvPQCWdUJ9dtV4keBS2RKmP'
    },
    {
        ticket_number: '4',
        date: 'NOV 4 2022',
        location: 'Bogotá, Colombia',
        genre: 'Rap',
        artists: ['The Rolling Stones', 'The Beatles'],
        sponsors: ['Heavy Duty Builders', 'Solana University'],
        website: 'https://heavyduty.builders',
        wallet: '75g5AdQBi4QZg53wQMdX4nvPQCWdUJ9dtV4keBS2RKmP'
    }
];
main(data)
    .then(function (result) {
    console.log(result);
});
// export default main;

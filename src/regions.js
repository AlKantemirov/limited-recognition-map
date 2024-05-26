"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regions = void 0;
var africa_json_1 = __importDefault(require("../data/africa.json"));
var middle_east_json_1 = __importDefault(require("../data/middle-east.json"));
var south_caucasus_json_1 = __importDefault(require("../data/south-caucasus.json"));
var asia_json_1 = __importDefault(require("../data/asia.json"));
var europe_json_1 = __importDefault(require("../data/europe.json"));
var oceania_json_1 = __importDefault(require("../data/oceania.json"));
var north_america_json_1 = __importDefault(require("../data/north-america.json"));
var south_america_json_1 = __importDefault(require("../data/south-america.json"));
exports.Regions = [
    africa_json_1.default,
    middle_east_json_1.default,
    south_caucasus_json_1.default,
    asia_json_1.default,
    europe_json_1.default,
    oceania_json_1.default,
    north_america_json_1.default,
    south_america_json_1.default
];

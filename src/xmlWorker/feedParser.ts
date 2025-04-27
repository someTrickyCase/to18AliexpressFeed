import { XMLParser } from "fast-xml-parser";
import fs from "node:fs";

export function parseFeedFromFile(pathToFile: string) {
    const xmlParserOptions = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        allowBooleanAttributes: true,
        suppressBooleanAttributes: false,
    };
    const parser = new XMLParser(xmlParserOptions);

    const readedData = fs.readFileSync(pathToFile, { encoding: "utf-8" });

    return parser.parse(readedData);
}

export function parseFeedFromString(xmlFeed: string) {
    const xmlParserOptions = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        allowBooleanAttributes: true,
        suppressBooleanAttributes: false,
    };
    const parser = new XMLParser(xmlParserOptions);
    return parser.parse(xmlFeed);
}

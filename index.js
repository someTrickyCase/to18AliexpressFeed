"use strict";
const { XMLParser, XMLBuilder } = require("fast-xml-parser");
const fs = require("node:fs");

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
});

async function getXML(url) {
    const xml = await fetch(url);
    return await xml.text();
}

const xmlTeamplate = {
    "?xml": {
        "@_version": "1.0",
        "@_encoding": "UTF-8",
    },
    yml_catalog: {
        shop: {
            name: "to18_toAliexpress",
            company: "to18",
            url: "https://to18.ru",
            currencies: {},
            categories: {},
            agency: "Troffi.ru",
            email: "aa@troffi.ru",
            offers: { offer: [] },
        },
    },
};

getXML(
    "https://to18.ru/wp-content/uploads/woo-product-feed-pro/xml/uunu2Q58c6U9P1hIKr1ljyIFbAumrU7z.xml"
).then((r) => {
    const xmlThree = parser.parse(r);

    xmlTeamplate.yml_catalog.shop.currencies = xmlThree.yml_catalog.shop.currencies;
    xmlTeamplate.yml_catalog.shop.categories = xmlThree.yml_catalog.shop.categories;

    const { offers } = xmlThree.yml_catalog.shop;
    offers.offer.map((product) => {
        const { weight, lenght, height, width } = product;
        if (!weight || !lenght || !height | !width) return;

        // recalculate price and add to new xmlObj
        const oldPrice = +product.price.split(",")[0].replace(" ", "");
        if (weight <= 2) product.price = oldPrice + 159;
        else if (weight <= 5) product.price = oldPrice + 359;
        else if (weight <= 20) product.price = oldPrice + 659;
        else return;

        xmlTeamplate.yml_catalog.shop.offers.offer.push({ ...product });
    });

    // write file
    const builder = new XMLBuilder({ ignoreAttributes: false });
    const xmlContent = builder.build(xmlTeamplate);
    fs.writeFile("/var/www/default/xmlFeedToAliexpress.xml", xmlContent, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("new xml writed successfully");
        }
    });
});

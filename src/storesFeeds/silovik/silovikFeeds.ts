import getAllCategoriesInStore from "../../api/getAllCategories";
import getAllProductsInStore from "../../api/getAllProducts";
import { fullFeedsOutputDirectory } from "../../conf";
import { Credentials } from "../../types/types";
import buildFeed from "../../xmlWorker/feedBuilder";
import fs from "node:fs";

export default async function silovikFeedsManager() {
    const silovikStoreLink = process.env.silovik_url;
    const silovikCredentials: Credentials = {
        key: process.env.silovik_wcKey,
        secret: process.env.silovik_wcSecret,
    };

    if (!silovikStoreLink || !silovikCredentials.key || !silovikCredentials.secret) return;

    async function getSilovikCategories() {
        if (!silovikStoreLink) return;
        const res = await getAllCategoriesInStore(silovikStoreLink, silovikCredentials);
        return res;
    }

    async function getSilovikProducts() {
        if (!silovikStoreLink) return;
        const res = await getAllProductsInStore(silovikStoreLink, silovikCredentials);
        return res;
    }

    //
    const products = await getSilovikProducts();
    const categories = await getSilovikCategories();
    if (!products || !categories) return;

    // generate Full feed
    const feedName = "silovik_FullFeed";
    const fullFeed = buildFeed(feedName, silovikStoreLink, products, categories);
    fs.writeFileSync(`${fullFeedsOutputDirectory}/${feedName}.xml`, fullFeed, {
        encoding: "utf-8",
    });
}

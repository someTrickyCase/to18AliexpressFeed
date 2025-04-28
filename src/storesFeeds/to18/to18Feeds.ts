import getAllCategoriesInStore from "../../api/getAllCategories";
import getAllProductsInStore from "../../api/getAllProducts";
import { fullFeedsOutputDirectory, specialFeedsOutputDirectory } from "../../conf";
import { Credentials, Product } from "../../types/types";
import buildFeed from "../../xmlWorker/feedBuilder";
import fs from "node:fs";

export default async function to18FeedsManager() {
    const to18StoreLink = process.env.to18_url;
    const to18Credentials: Credentials = {
        key: process.env.to18_wcKey,
        secret: process.env.to18_wcSecret,
    };

    if (!to18StoreLink || !to18Credentials.key || !to18Credentials.secret) {
        console.info("There are no credentials data");
        return;
    }

    async function getTo18Categories() {
        if (!to18StoreLink) return;
        const res = await getAllCategoriesInStore(to18StoreLink, to18Credentials);
        return res;
    }

    async function getTo18Products() {
        if (!to18StoreLink) return;
        const res = await getAllProductsInStore(to18StoreLink, to18Credentials);
        return res;
    }

    //
    const products = await getTo18Products();
    const categories = await getTo18Categories();
    if (!products || !categories) return;

    // generate Full feed
    const feedName = "to18_FullFeed";
    const fullFeed = buildFeed(feedName, to18StoreLink, products, categories);
    fs.writeFileSync(`${fullFeedsOutputDirectory}/${feedName}.xml`, fullFeed, {
        encoding: "utf-8",
    });

    // generate Feed to Aliexpress
    const feedToAliName = "to18_toAliexpressFeed";
    const recaulculatedProducts = recalculateFeedForAliexpress(products);
    const toAliFeed = buildFeed(feedToAliName, to18StoreLink, recaulculatedProducts, categories);
    fs.writeFileSync(`${specialFeedsOutputDirectory}/${feedToAliName}.xml`, toAliFeed, {
        encoding: "utf-8",
    });
}

function recalculateFeedForAliexpress(products: Product[]) {
    products.map((product) => {
        const oldPrice = +product.price.split(",")[0].replace(" ", "");

        if (+product.weight <= 2) product.price = `${oldPrice + 159}`;
        else if (+product.weight <= 5) product.price = `${oldPrice + 359}`;
        else if (+product.weight <= 20) product.price = `${oldPrice + 659}`;
        else return;
    });

    return products;
}

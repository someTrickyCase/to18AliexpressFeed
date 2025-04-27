import { XMLBuilder } from "fast-xml-parser";
import { Category, Product, YmlCategory, YmlProduct } from "../types/types";

const xmlParserOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true,
    suppressBooleanAttributes: false,
};

export default function buildFeed(
    feedName: string,
    storeLink: string,
    products: Product[],
    categories: Category[]
) {
    const xmlTeamplate = {
        "?xml": {
            "@_version": "1.0",
            "@_encoding": "UTF-8",
        },
        yml_catalog: {
            shop: {
                name: feedName,
                company: "to18",
                url: storeLink,
                currencies: {
                    "@_id": "RUB",
                    "@_rate": "1",
                },
                categories: [] as YmlCategory[],
                agency: "Troffi.ru",
                email: "aa@troffi.ru",
                offers: { offer: [] as YmlProduct[] },
            },
        },
    };

    categories.map((category) => {
        xmlTeamplate.yml_catalog.shop.categories.push({
            "@_parentId": category.parent,
            "@_id": category.id,
            name: category.name,
        });
    });

    products.map((product) => {
        xmlTeamplate.yml_catalog.shop.offers.offer.push({
            "@_available": product.status === "publish" ? true : false,
            "@_id": product.id,
            categoryId: product.categories[0].id,
            description: product.description.replace(/<[^>]*>/g, ""),
            images: product.images.map((image) => image?.src).join(),
            picture: product.images[0]?.src,
            name: product.name,
            price: product.price,
            sku: product.sku,
            count: product.stock_quantity,
            weight: product.weight,
            height: product.dimensions?.height,
            width: product.dimensions?.width,
            length: product.dimensions?.length,
        });
    });

    const builder = new XMLBuilder(xmlParserOptions);
    const xmlContent = builder.build(xmlTeamplate);

    return xmlContent;
}

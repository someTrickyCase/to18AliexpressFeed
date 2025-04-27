import { Credentials, Product } from "../types/types";

async function getTotalProductQuantity(storeLink: string, credentials: Credentials) {
    const res = await fetch(`${storeLink}/wp-json/wc/v3/products?per_page=1`, {
        headers: {
            authorization: `Basic ${btoa(credentials.key + ":" + credentials.secret)}`,
            "content-type": "application/json",
        },
    });

    // resive total products quantity
    return Number(res.headers.get("x-wp-total"));
}

export default async function getAllProductsInStore(storeLink: string, credentials: Credentials) {
    const allProducts: Product[] = [];

    const totalQuantity = await getTotalProductQuantity(storeLink, credentials);
    console.log(`Will be fecthed ${totalQuantity} products from ${storeLink}`);

    const pagesQuantity = Math.ceil(totalQuantity / 100);

    for (let curPage = 1; curPage <= pagesQuantity; curPage++) {
        const res = await fetch(
            `${storeLink}/wp-json/wc/v3/products?per_page=100&page=${curPage}`,
            {
                headers: {
                    authorization: `Basic ${btoa(credentials.key + ":" + credentials.secret)}`,
                    "content-type": "application/json",
                },
            }
        );

        const data = (await res.json()) as Product[];
        data.map((item) => {
            allProducts.push({
                attributes: item.attributes,
                categories: item.categories,
                description: item.description,
                id: item.id,
                images: item.images,
                name: item.name,
                on_sale: item.on_sale,
                price: item.price,
                regular_price: item.regular_price,
                sale_price: item.sale_price,
                sku: item.sku,
                status: item.status,
                stock_quantity: item.stock_quantity,
                weight: item.weight,
                dimensions: item.dimensions,
            });
        });
        console.log(`Deal with ${curPage} from ${pagesQuantity} pages`);
    }

    console.log("All products are fetched successfully");
    return allProducts;
}

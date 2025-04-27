import { Category, Credentials } from "../types/types";

async function getTotalCategoriesQuantity(storeLink: string, credentials: Credentials) {
    const res = await fetch(`${storeLink}/wp-json/wc/v3/products/categories?per_page=1`, {
        headers: {
            authorization: `Basic ${btoa(credentials.key + ":" + credentials.secret)}`,
            "content-type": "application/json",
        },
    });

    // resive total categories quantity
    return Number(res.headers.get("x-wp-total"));
}

export default async function getAllCategoriesInStore(storeLink: string, credentials: Credentials) {
    const allCategories: Category[] = [];

    const totalQuantity = await getTotalCategoriesQuantity(storeLink, credentials);
    console.log(`Will be fecthed ${totalQuantity} categoryes from ${storeLink}`);

    const pagesQuantity = Math.ceil(totalQuantity / 100);

    for (let curPage = 1; curPage <= pagesQuantity; curPage++) {
        const res = await fetch(
            `${storeLink}/wp-json/wc/v3/products/categories?per_page=100&page=${curPage}`,
            {
                headers: {
                    authorization: `Basic ${btoa(credentials.key + ":" + credentials.secret)}`,
                    "content-type": "application/json",
                },
            }
        );

        const data = (await res.json()) as Category[];
        data.map((item: Category) => {
            allCategories.push({ id: item.id, parent: item.parent, name: item.name });
        });
        console.log(`Deal with ${curPage} from ${pagesQuantity} pages`);
    }

    console.log("All categories are fetched successfully");
    return allCategories;
}

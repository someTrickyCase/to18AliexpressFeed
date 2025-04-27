export type Credentials = {
    key: string | undefined;
    secret: string | undefined;
};

export type Image = {
    id: number;
    alt: string;
    name: string;
    src: string;
};

export type Product = {
    attributes: {
        name: string;
        options: string[];
    }[];
    categories: {
        id: string;
        name: string;
    }[];
    description: string;
    id: number;
    images: Image[];
    name: string;
    on_sale: boolean;
    price: string;
    regular_price: string;
    sale_price: string;
    sku: string;
    status: "draft" | "publish";
    stock_quantity: null | number;
    weight: string;
    dimensions: {
        height: string;
        width: string;
        length: string;
    };
};

export type YmlProduct = {
    "@_id": number;
    "@_available": boolean;
    categoryId: string;
    description: string;
    images: string;
    picture: string;
    name: string;
    price: string;
    sku: string;
    count: null | number;
    weight: string;
    height: string;
    width: string;
    length: string;
};

export type Category = {
    id: number;
    parent: number;
    name: string;
};

export type YmlCategory = {
    "@_id": number;
    "@_parentId": number;
    name: string;
};

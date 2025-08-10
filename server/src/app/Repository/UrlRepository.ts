import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { eq, desc, like, and, notInArray, sql } from "drizzle-orm";

interface StoreUrlRequest {
    url: string;
    name: string;
}

interface UpdateUrlRequest {
    id: string;
    name: string;
    url: string;
}

interface GetUrlRequest {
    search?: string;
    page?: number;
    pageSize?: number;
}

type GetUrlResponse = {
    data: {
        id: string;
        name: string;
        url: string;
        createdAt: Date;
        count_access: number | null;
    }[];
    total: number;
    page: number;
    pageSize: number;
}

interface UrlExportResponse {
    data: {
        id: string;
        name: string;
        url: string;
        createdAt: Date;
        count_access: number | null;
    }[];
}

interface StoreUrlResponse {
    data: {
        id: string;
        name: string;
        url: string;
        createdAt: Date;
        count_access: number | null;
    };
}

interface UpdateUrlResponse {
    data: {
        id: string;
        name: string;
        url: string;
        createdAt: Date;
        count_access: number | null;
    };
}

interface GetUrlByShortUrlResponse {
    url: string;
    count_access: number | null;
}

export async function getUrl(data: GetUrlRequest): Promise<GetUrlResponse> {

    const page = data.page ?? 1;
    const pageSize = data.pageSize ?? 10;
    const search = data.search ?? "";

    const result = await db.select().from(schema.link_shorteners)
        .where(like(schema.link_shorteners.name, `%${search}%`))
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(desc(schema.link_shorteners.createdAt));

    return {
        data: result,
        total: result.length,
        page: page,
        pageSize: pageSize
    }
}

export async function storeUrl(data: StoreUrlRequest): Promise<StoreUrlResponse> {
    const url = await db.select()
        .from(schema.link_shorteners)
        .where(eq(schema.link_shorteners.name, data.name))
        .limit(1);

    if (url.length > 0) {
        throw new Error("Name url already exists");
    }

    const result = await db.insert(schema.link_shorteners).values({
        url: data.url,
        name: data.name,
        createdAt: new Date(),
        count_access: 0
    }).returning();

    console.log(result[0], 1);

    return {
        data: result[0]
    };
}

export async function checkUrlExists(id: string) {
    const url = await db.select()
        .from(schema.link_shorteners)
        .where(eq(schema.link_shorteners.id, id))
        .limit(1);

    return url.length > 0;
}

export async function deleteUrl(id: string) {
    var exists = await checkUrlExists(id);
    if (!exists) {
        throw new Error("Url not found");
    }

    await db.delete(schema.link_shorteners)
        .where(eq(schema.link_shorteners.id, id));

    return true;
}

export async function updateUrl(data: UpdateUrlRequest): Promise<UpdateUrlResponse> {
    var exists = await checkUrlExists(data.id);
    if (!exists) {
        throw new Error("Url not found");
    }

    const url = await db.select()
        .from(schema.link_shorteners)
        .where(and(eq(schema.link_shorteners.name, data.name), notInArray(schema.link_shorteners.id, [data.id])))
        .limit(1);

    if (url.length > 0) {
        throw new Error("Name url already exists");
    }

    const result = await db.update(schema.link_shorteners).set({
        name: data.name,
        url: data.url
    }).where(eq(schema.link_shorteners.id, data.id)).returning();

    return {
        data: result[0]
    };
}

export async function getUrlByShortUrl(shortUrl: string): Promise<GetUrlByShortUrlResponse> {
    const data = await db.select()
        .from(schema.link_shorteners)
        .where(eq(schema.link_shorteners.name, shortUrl))
        .limit(1);

    if (data.length === 0) {
        throw new Error("Url not found");
    }

    await db.update(schema.link_shorteners).set({
        count_access: sql`${schema.link_shorteners.count_access} + 1`
    }).where(eq(schema.link_shorteners.name, shortUrl)).returning();

    return {
        url: data[0].url,
        count_access: (data[0].count_access ?? 0) + 1
    }
}

export async function urlExport(searchQuery: string): Promise<UrlExportResponse> {
    let query = db.select().from(schema.link_shorteners).$dynamic();
    if (searchQuery && searchQuery.trim() !== "") {
        query = query.where(like(schema.link_shorteners.name, `%${searchQuery}%`));
    }
    const data = await query;

    return {
        data: data
    };
}

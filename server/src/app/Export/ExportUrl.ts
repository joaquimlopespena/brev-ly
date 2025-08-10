import { pipeline } from "node:stream/promises";
import { stringify } from "csv-stringify";
import { schema } from "@/infra/db/schemas";
import { db, pg } from "@/infra/db";
import { ilike } from "drizzle-orm";
import { PassThrough } from "node:stream";
import { Transform } from "node:stream";
import { uploadFileToStorage } from "@/storage/upload-file-to-storage";

export const exportUrl = async (searchQuery: string) => {

    const {sql, params} = db.select({
        name: schema.link_shorteners.name,
        url: schema.link_shorteners.url,
        createdAt: schema.link_shorteners.createdAt,
        count_access: schema.link_shorteners.count_access,
    }).from(schema.link_shorteners).where(
        searchQuery ? ilike(schema.link_shorteners.name, `%${searchQuery}%`) : undefined
    ).toSQL(); 

    const cursor = await pg.unsafe(sql, params as string[]).cursor(2);

    const csv = await await stringify({
        delimiter: ";",
        header: true,
        columns: [
            {key: "name", header: "Name"},
            {key: "url", header: "URL"},
            {key: "created_at", header: "Created At"},
            {key: "count_access", header: "Count Access"},
        ],
    });

    const uploadToStorageStream = new PassThrough();

    const csvStream = pipeline(
        cursor,
        new Transform({
            objectMode: true,
            transform(chunks: unknown[], encoding, callback) {
                for (const chunk of chunks) {
                    this.push(chunk);
                }
                callback();
            }
        }),
        csv,
        uploadToStorageStream
    )

    const uploadResult = await uploadFileToStorage({
        folder: "downloads",
        filename: `${new Date().toISOString()}.csv`,
        contentType: "text/csv",
        contentStream: uploadToStorageStream,
    });

    const [{url}] = await Promise.all([
        uploadResult,
        csvStream,
    ]);

    return {
        message: "Url exported successfully",
        url: url,
    };
}

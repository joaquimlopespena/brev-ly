import { getUrl } from "@/app/Repository/UrlRepository";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const getUrlSchema = z.object({
    search: z.string().optional(),
    page: z.number().optional().default(1),
    pageSize: z.number().optional().default(10),
});

type GetUrlRequest = z.infer<typeof getUrlSchema>;

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
};

export class GetUrlController {
    async handle(input: GetUrlRequest): Promise<GetUrlResponse> {
        try {
            const validatedData = getUrlSchema.parse(input);

            const result = await getUrl(validatedData);
    
            return {
                data: result.data,
                total: result.total,
                page: validatedData.page ?? 1,
                pageSize: validatedData.pageSize ?? 10
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

import { storeUrl, getUrlByShortUrl } from "@/app/Repository/UrlRepository";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const resolveShortUrlSchema = z.object({
    shortUrl: z.string().min(1, "URL is required"),
});

type ResolveShortUrlRequest = z.infer<typeof resolveShortUrlSchema>;

type ResolveShortUrlResponse = {
    url: string;
    count_access: number | null;
}

export class ResolveShortUrlController {

    async handle(req: FastifyRequest<{ Params: { shortUrl: string } }>, res: FastifyReply): Promise<ResolveShortUrlResponse> {
        try {
            const { shortUrl } = req.params;

            const { url, count_access } = await getUrlByShortUrl(shortUrl);

            return {
                url: url,
                count_access: count_access
            }
        } catch (error) {
            return res.status(404).send({ message: "Url not found" });
        }
    }
}
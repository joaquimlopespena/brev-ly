import { ExportUrlController } from "@/app/Http/Controller/ExportUrlController";
import { getUrlByShortUrl } from "@/app/Repository/UrlRepository";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

export const exportUrl = async (app: FastifyInstance) => {
    app.post("/url/export", {
        schema: {
            summary: "Export a url",
            description: "Export a url",
            tags: ["url"],
            querystring: z.object({
                searchQuery: z.string().optional(),
            }),
        },
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            const controller = new ExportUrlController();
            const result = await controller.handle(request.query as any, reply);
            return reply.status(200).send(result);
        },
    });
};
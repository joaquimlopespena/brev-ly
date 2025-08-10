import { exportUrl } from "@/app/Export/ExportUrl";
import { FastifyRequest, FastifyReply } from "fastify";

type ExportUrlResponse = {
    message: string;
    url: string;
}

type ExportUrlRequest = {
    searchQuery: string;
}

export class ExportUrlController {

    async handle(request: ExportUrlRequest, reply: FastifyReply): Promise<ExportUrlResponse> {
        try {
            const { searchQuery } = request;
            const url = await exportUrl(searchQuery);
            return {
                message: "Url exported successfully",
                url: url.url,
            };
        } catch (error) {
            throw error;
        }
    }
}
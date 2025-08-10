import { deleteUrl } from "@/app/Repository/UrlRepository";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const deleteUrlSchema = z.object({
    id: z.string(),
});

type DeleteUrlRequest = z.infer<typeof deleteUrlSchema>;
interface DeleteUrlResponse {
    message?: string;
}

export class DeleteUrlController {
    async handle(input: DeleteUrlRequest): Promise<DeleteUrlResponse> {
        try {
            const validatedData = deleteUrlSchema.parse(input);
            console.log(validatedData.id, 11);
            await deleteUrl(validatedData.id);
            
            return {
                message: "URL deleted successfully"
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
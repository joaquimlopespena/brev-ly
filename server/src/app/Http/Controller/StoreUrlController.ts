import { storeUrl } from "@/app/Repository/UrlRepository";
import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

const storeUrlSchema = z.object({
    url: z.string()
        .url("Invalid URL format")
        .min(1, "URL is required").refine((value) => {
            // Valida que a URL começa com http:// ou https://
            // e contém "://" corretamente
            return /^(https?:\/\/)[^\s$.?#].[^\s]*$/i.test(value);
          }, {
            message: "Invalid URL format",
          }),
    name: z.string()
        .min(1, "Name is required")
        .max(50, "Name must be less than 50 characters")
        .regex(/^[a-zA-Z0-9-_]+$/, "Name can only contain letters, numbers, hyphens and underscores")
});

type StoreUrlRequest = z.infer<typeof storeUrlSchema>;

type StoreUrlResponse = {
    data: {
        id: string;
        name: string;
        url: string;
        createdAt: Date;
        count_access: number | null;
    }[];
    message: string;
}

export class StoreUrlController {
    async handle(req: FastifyRequest, reply: FastifyReply): Promise<StoreUrlResponse> {
        try {
            const validatedData = storeUrlSchema.parse(req.body);
            const {data} = await storeUrl(validatedData);
            
            return {
                data: [data],
                message: "URL criada com sucesso"
            };
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    message: "Dados inválidos fornecidos",
                    error: error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
                });
            }
            
            if (error instanceof Error) {
                return reply.status(400).send({
                    message: "Falha ao armazenar URL",
                    error: error.message
                });
            }

            return reply.status(500).send({
                message: "Erro interno do servidor",
                error: "Ocorreu um erro inesperado"
            });
        }
    }
}

import { updateUrl } from "@/app/Repository/UrlRepository";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const updateUrlSchema = z.object({
    id: z.string(),
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

type UpdateUrlRequest = z.infer<typeof updateUrlSchema>;

type UpdateUrlResponse = {
    data: {
        id: string;
        name: string;
        url: string;
        createdAt: Date;
        count_access: number | null;
    }[];
    message: string;
}

export class UpdateUrlController {

    async handle(req: FastifyRequest, reply: FastifyReply): Promise<UpdateUrlResponse> {
        try {
            const {id} = req.params as any;
            var data = {id, ...req.body as any};
            console.log(id, 11);
            const validatedData = updateUrlSchema.parse(data);
            const {data: result} = await updateUrl(validatedData);

            return {
                data: [result],
                message: "URL atualizada com sucesso"
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
                    message: "Falha ao atualizar URL",
                    error: error.message
                });
            }
            
            return reply.status(500).send({
                message: "Erro interno do servidor",
                error: "Erro desconhecido"
            });
        }
    }
}
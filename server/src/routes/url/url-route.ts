import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { GetUrlController } from "@/app/Http/Controller/GetUrlController";

import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { StoreUrlController } from "@/app/Http/Controller/StoreUrlController";
import { DeleteUrlController } from "@/app/Http/Controller/DeleteUrlController";
import { UpdateUrlController } from "@/app/Http/Controller/UpdateUrlController";
import { ResolveShortUrlController } from "@/app/Http/Controller/ResolveShortUrlController";

const getUrlSchema = z.object({
    search: z.string().optional(),
    page: z.coerce.number().default(1).optional(),
    pageSize: z.coerce.number().default(20).optional(),
});

export const getRoot: FastifyPluginAsyncZod = async (app: FastifyInstance) => {
    app.get("/", (request, reply) => {
        return reply.status(200).send({
            message: "Hello World"
        });
    });
}

export const getUrl: FastifyPluginAsyncZod = async (app: FastifyInstance) => {
    app.get("/url", {
        schema: {
            summary: "List all urls",
            description: "List all urls",
            tags: ["url"],
            response: {
                200: z.object({
                    data: z.array(z.object({
                        id: z.string(),
                        name: z.string(),
                        url: z.string(),
                        createdAt: z.date(),
                        count_access: z.number().nullable(),
                    })),
                    total: z.number(),
                    page: z.coerce.number().default(1).optional(),
                    pageSize: z.coerce.number().default(20).optional(),
                }),
            },
            querystring: getUrlSchema,
        },
        handler: async (request, reply) => {
            const controller = new GetUrlController();
            const result = await controller.handle(request.query as any);

            return reply.status(200).send(result);
        }
    });
}

export const storeUrl: FastifyPluginAsyncZod = async (app: FastifyInstance) => {
    app.post("/url/store", {
        schema: {
            summary: "Store a url",
            description: "Store a url",
            tags: ["url"],
            response: {
                200: z.object({
                    data: z.object({
                        id: z.string(),
                        name: z.string(),
                        url: z.string(),
                        createdAt: z.date(),
                        count_access: z.number().nullable(),
                    }),
                    message: z.string(),
                }),
                400: z.object({
                    message: z.string(),
                    error: z.string(),
                }),
                500: z.object({
                    message: z.string(),
                    error: z.string(),
                    issues: z.any(),
                }),
            },
            body: z.object({
                url: z.string().min(1, "URL is required"),
                name: z.string().min(1, "Name is required"),
            }),
        },
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const controller = new StoreUrlController();

                //console.log(request.body);
                const {data, message} = await controller.handle(request, reply);
                return reply.status(200).send({
                    message: message,
                    data: data[0],
                }); 
            } catch (error) {
                if (error instanceof z.ZodError) {
                    console.log(error.errors);
                    return reply.status(400).send({
                        message: "Dados inválidos fornecidos",
                        error: JSON.stringify(error.errors)
                    });
                }

                return reply.status(500).send({
                    message: "Erro interno do servidor",
                    error: error instanceof Error ? error.message : "Erro desconhecido ocorreu"
                });
            }
        }
    });
}

export const updateUrl: FastifyPluginAsyncZod = async (app: FastifyInstance) => {
    app.put("/url/update/:id", {
        schema: {
            summary: "Update a url",
            description: "Update a url",
            tags: ["url"],
            response: {
                200: z.object({
                    data: z.object({
                        id: z.string(),
                        name: z.string(),
                        url: z.string(),
                        createdAt: z.date(),
                        count_access: z.number().nullable(),
                    }),
                    message: z.string(),
                }),
                400: z.object({
                    message: z.string(),
                    error: z.string(),
                }),
                500: z.object({
                    message: z.string(),
                    error: z.string(),
                    issues: z.any(),
                }),
            },
            params: z.object({
                id: z.string(),
            }),
            body: z.object({
                url: z.string().min(1, "URL is required"),
                name: z.string().min(1, "Name is required"),
            }),
        },
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const controller = new UpdateUrlController();

                const {data, message} = await controller.handle(request, reply);
                return reply.status(200).send({
                    message: message,
                    data: data[0],
                }); 
            } catch (error) {
                if (error instanceof z.ZodError) {
                    console.log(error.errors);
                    return reply.status(400).send({
                        message: "Dados inválidos fornecidos",
                        error: JSON.stringify(error.errors)
                    });
                }

                return reply.status(500).send({
                    message: "Erro interno do servidor",
                    error: error instanceof Error ? error.message : "Erro desconhecido ocorreu"
                });
            }
        }
    });
}

export const deleteUrl: FastifyPluginAsyncZod = async (app: FastifyInstance) => {
    app.delete("/url/delete/:id", {
        schema: {
            summary: "Delet a url",
            description: "Delet a url",
            tags: ["url"],
            params: z.object({
                id: z.string(),
            }),
            response: {
                200: z.object({
                    message: z.string(),
                }),
                400: z.object({
                    error: z.string(),
                }),
                500: z.object({
                    error: z.string(),
                }),
            },
        },
        handler: async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const { id } = request.params as any;
                console.log(id, 33);
                const controller = new DeleteUrlController();
                const result = await controller.handle(request.params as any);

                return reply.status(200).send({
                    data: result,
                    message: "URL deleted successfully",
                });
            } catch (error) {
                if (error instanceof z.ZodError) {
                    console.log(error.errors);
                    return reply.status(400).send({
                        message: "Dados inválidos fornecidos",
                        error: JSON.stringify(error.errors)
                    });
                }

                return reply.status(400).send({
                    error: error instanceof Error ? error.message : "Erro desconhecido ocorreu"
                });
            }
        }
    });
}

export const resolveShortUrl: FastifyPluginAsyncZod = async (app: FastifyInstance) => {
    app.get("/:shortUrl", {
        schema: {
            summary: "Resolve a short url",
            description: "Resolve a short url",
            tags: ["url"],
            response: {
                200: z.object({
                    url: z.string(),
                    count_access: z.number().nullable(),
                }),
            },
            params: z.object({
                shortUrl: z.string(),
            }),
        },
        handler: async (request: FastifyRequest<{ Params: { shortUrl: string } }>, reply: FastifyReply) => {
            try {
                const controller = new ResolveShortUrlController();
                const result = await controller.handle(request, reply);

                return reply.status(200).send(result);
            } catch (error) {
                return reply.status(404).send({ message: "Url not found" });
            }
        },
    });
}

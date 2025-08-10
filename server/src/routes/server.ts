import { fastify, FastifyInstance } from "fastify";
import { env } from "../infra/env";
import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors, jsonSchemaTransform } from "fastify-type-provider-zod";
import { deleteUrl, getRoot, getUrl, resolveShortUrl, storeUrl, updateUrl } from "./url/url-route";
import { exportUrl } from "./url/export-url";

export async function build(): Promise<FastifyInstance> {
    const server = fastify({ logger: false });

    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);

    server.setErrorHandler((error, request, reply) => {
        if (hasZodFastifySchemaValidationErrors(error)) {
            return reply.status(400).send({
                message: "Validation error",
                issues: error.validation,
            });
        }

        /* console.error(error); */
        console.log(error);
        return reply.status(500).send({
            message: "Internal server error",
        });
    });


    server.register(fastifyCors, {
        origin: "*",
    })

    server.register(fastifyMultipart)
    server.register(fastifySwagger, {
        openapi: {
            info: {
                title: "Upload Server",
                version: "1.0.0",
            }
        },
        transform: jsonSchemaTransform,
    });

    server.register(fastifySwaggerUi, {
        routePrefix: "/docs",
    });

    server.register(getUrl);
    server.register(getRoot);
    server.register(storeUrl);
    server.register(deleteUrl);
    server.register(updateUrl);
    server.register(resolveShortUrl);
    server.register(exportUrl);

    return server;
}

// Inicialização do servidor apenas se não estiver em modo de teste
if (process.env.NODE_ENV !== 'test') {
    build().then(server => {
        server.listen({ port: env.PORT, host: '127.0.0.1' }, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }

            console.log(`Server is running on ${address}`);
        });
    }).catch(err => {
        console.error('Failed to build server:', err);
        process.exit(1);
    });
}

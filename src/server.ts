import Fastify from "fastify";
import { ZodError } from "zod";
import { customersRoutes } from "./routes/customersRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

const app = Fastify({ logger: true });

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: error.issues[0]?.message ?? "Dados inválidos" });
  }

  if (error instanceof Error) {
    return reply.status(400).send({ message: error.message });
  }

  console.error(error);
  return reply.status(500).send({ message: "Erro interno do servidor" });
});

await app.register(jwt, {
  secret: process.env["JWT_SECRET"] as string,
  sign: {
    expiresIn: "2d",
  },
});
await app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
await app.register(customersRoutes);
await app.register(userRoutes);

const start = async () => {
  try {
    await app.listen({ port: 4000 });
  } catch (err) {
    console.log(err);

    process.exit(1);
  }
};

start();

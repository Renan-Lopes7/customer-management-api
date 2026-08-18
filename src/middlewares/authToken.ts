import { FastifyRequest, FastifyReply } from "fastify";

export async function authToken(request: FastifyRequest, _reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    throw new Error("Token inválido");
  }
}

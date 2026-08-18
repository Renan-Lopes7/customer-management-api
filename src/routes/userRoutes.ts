import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { CreateUsercontroller } from "../controllers/users/UserController.js";
import { LoginUserController } from "../controllers/users/LoginUserController.js";
import { UpdateUserController } from "../controllers/users/UpdateUserController.js";
import { DeleteUserController } from "../controllers/users/DeleteUserController.js";

import { authToken } from "../middlewares/authToken.js";

export function userRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
) {
  fastify.post("/user", (req: FastifyRequest, reply: FastifyReply) => {
    return new CreateUsercontroller().handle(req, reply);
  });
  fastify.post("/user/login", (req: FastifyRequest, reply: FastifyReply) => {
    return new LoginUserController().handle(req, reply);
  });
  fastify.patch(
    "/user/:id",
    { onRequest: authToken },
    (req: FastifyRequest, reply: FastifyReply) => {
      return new UpdateUserController().handle(req, reply);
    },
  );
  fastify.delete(
    "/user/:id",
    { onRequest: authToken },
    (req: FastifyRequest, reply: FastifyReply) => {
      return new DeleteUserController().handle(req, reply);
    },
  );
}

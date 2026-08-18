import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { CreatedCustomerController } from "../controllers/customers/CreateCustomerController.js";
import { ListCustomersController } from "../controllers/customers/ListCustomersController.js";
import { DeleteCustomerController } from "../controllers/customers/DeleteCustomerController.js";
import { UpdateControllerCustomer } from "../controllers/customers/UpdateCustomerController.js";
import { GetOneCustomerController } from "../controllers/customers/GetOneCustomerController.js";

import { authToken } from "../middlewares/authToken.js";

export async function customersRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
) {
  fastify.post(
    "/customer",
    { onRequest: [authToken] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new CreatedCustomerController().handle(request, reply);
    },
  );

  fastify.get(
    "/customers",
    { onRequest: [authToken] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ListCustomersController().handle(request, reply);
    },
  );
  fastify.delete(
    "/customer/:id",
    { onRequest: [authToken] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new DeleteCustomerController().handle(request, reply);
    },
  );
  fastify.patch(
    "/customer/:id",
    { onRequest: [authToken] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new UpdateControllerCustomer().handle(request, reply);
    },
  );
  fastify.get(
    "/customer/:id",
    { onRequest: [authToken] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new GetOneCustomerController().handle(request, reply);
    },
  );
}

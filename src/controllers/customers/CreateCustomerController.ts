import { FastifyRequest, FastifyReply } from "fastify";
import { CreatedCustomerService } from "../../services/customerServices/CreateCustomerService.js";
import { createCustomerSchema } from "../../schema/customerSchema.js";

class CreatedCustomerController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email } = createCustomerSchema.parse(request.body);

    const userId = (request.user as { sub: number }).sub;

    const customerService = new CreatedCustomerService();

    const customer = await customerService.execute({ name, email, userId });

    reply.send(customer);
  }
}

export { CreatedCustomerController };

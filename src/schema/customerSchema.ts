import { z } from "zod";

export const createCustomerSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
  })
  .strict();

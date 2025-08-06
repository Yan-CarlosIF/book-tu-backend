import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { ICreateEstablishmentDTO } from "../../dto/Icreate-establishment.dto";
import { CreateEstablishmentUseCase } from "./create-establishment.useCase";

const cnpjMaskedRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const cepRegex = /^\d{5}-?\d{3}$/;

const createEstablishmentBodySchema = z.object({
  name: z.string(),
  cnpj: z
    .string()
    .regex(cnpjMaskedRegex, "CNPJ deve estar no formato 00.000.000/0000-00"),
  state: z.string(),
  city: z.string(),
  district: z.string(),
  cep: z.string().regex(cepRegex, "CEP deve estar no formato 00000-000"),
  description: z.string().optional(),
});

export class CreateEstablishmentController {
  async handle(
    request: Request<unknown, unknown, ICreateEstablishmentDTO>,
    response: Response
  ) {
    const { name, cnpj, state, city, district, cep, description } =
      createEstablishmentBodySchema.parse(request.body);

    const createEstablishmentUseCase = container.resolve(
      CreateEstablishmentUseCase
    );

    await createEstablishmentUseCase.execute({
      name,
      cnpj,
      state,
      city,
      district,
      cep,
      description,
    });

    return response.status(201).send();
  }
}

import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { IUpdateEstablishmentDTO } from "../../dto/Iupdate-establishment.dto";
import { UpdateEstablishmentUseCase } from "./update-establishment.useCase";

const cnpjMaskedRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const cepRegex = /^\d{5}-?\d{3}$/;

const updateEstablishmentBodySchema = z.object({
  name: z.string().optional(),
  cnpj: z
    .string()
    .regex(cnpjMaskedRegex, "CNPJ deve estar no formato 00.000.000/0000-00")
    .optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  cep: z
    .string()
    .regex(cepRegex, "CEP deve estar no formato 00000-000")
    .optional(),
  description: z.string().optional(),
});

const updateEstablishmentParamsSchema = z.object({
  id: z.string().uuid(),
});

type IParams = z.infer<typeof updateEstablishmentParamsSchema>;

export class UpdateEstablishmentController {
  async handle(
    request: Request<IParams, unknown, IUpdateEstablishmentDTO>,
    response: Response
  ) {
    const { id } = updateEstablishmentParamsSchema.parse(request.params);
    const { name, cnpj, state, city, district, cep, description } =
      updateEstablishmentBodySchema.parse(request.body);

    const updateEstablishmentUseCase = container.resolve(
      UpdateEstablishmentUseCase
    );

    await updateEstablishmentUseCase.execute(id, {
      name,
      cnpj,
      state,
      city,
      district,
      cep,
      description,
    });

    return response.status(200).send();
  }
}

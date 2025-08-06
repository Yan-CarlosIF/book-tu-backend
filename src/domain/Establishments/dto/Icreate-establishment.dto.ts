export interface ICreateEstablishmentDTO {
  name: string;
  cnpj: string;
  state: string;
  city: string;
  district: string;
  cep: string;
  description?: string;
}

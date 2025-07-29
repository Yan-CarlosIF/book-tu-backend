import { User } from "../infra/typeorm/entities/User";

export interface IUsersPaginationData {
  data: User[];
  page: number;
  total: number;
  lastPage: number;
}

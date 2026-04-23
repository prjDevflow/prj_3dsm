export type FetchLeadsParams = {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  importance?: string;
};

export interface IGetService {
  exec(params: FetchLeadsParams): Promise<{
    leads: any;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}

export interface ICreateService {
  exec(
    idCliente: string,
    idLoja: string,
    origem: string,
  ): Promise<{ data: any }>;
}

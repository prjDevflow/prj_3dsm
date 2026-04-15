export interface ICreateService{
    exec (inicio:string, fim: string): Promise<{}>
}
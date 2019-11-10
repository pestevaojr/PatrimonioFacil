export interface Inventario {
    idLocal?: number;
    idRemoto?: number;
    nome: string;
    dataCriacao?: Date;
    atual?: boolean;
    bens?: any[];
}

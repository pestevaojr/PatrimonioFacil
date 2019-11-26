import { Bem } from './bem';

export interface Inventario {
    id?: string;
    nome: string;
    dataCriacao?: Date;
    atual?: boolean;
    bens?: Bem[];
    uid?: string;
}

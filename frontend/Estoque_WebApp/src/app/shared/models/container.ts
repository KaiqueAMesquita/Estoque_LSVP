export interface Container {
    id?: number;
    code: string;
    description: string;
    type: ContainerType;
}

export enum ContainerType{
    ESTOQUE,
    PREPARACAO,
    DESCARTE
}
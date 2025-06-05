export interface LastMovements {
    date: Date;
    type: 'Entrada' | 'Saída';
    productName: string;
    quantity: number;
    origin_destination: string;
    userName: string;

}

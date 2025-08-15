export interface Category {
    id: number;
    description: string;
    created_at: Date;
    updated_at: Date;
    food_type: number; // 0 for 'perecível', 1 for 'não perecível'
    // !AVISO!
    // TEM QUE SER 'food_type' E NÃO 'type' PARA NÃO DAR CONFLITO COM O TIPO 'type' DO ANGULAR.
}
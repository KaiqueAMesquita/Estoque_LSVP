export interface Movement {
    id: number;
    quantity: number;
    type: 'Entrada' | 'Saída';
    origin: string;
    destiny: string;
    datetime: string; // ISO 8601 format
    sourceType: string;
    sourceDetails: string;
    unitId: number;
    unitProductGtin: string;
    unitBatch: string;
    userId: number;
    userName: string;
    OrderItem: number; 
    // Optionais (não lembro se vamos usar):
    /*
    productId?: number;
    containerId?: number;
    expiration_date?: string; // ISO 8601 format
    price?: number;
    */
}
//Model no Backend:
/*
private Long id;
    private int quantity;
    private MovementType type;
    private String origin;
    private String destiny;
    private LocalDateTime date;

    private ProductSource sourceType;
    private String sourceDetails;


    //Campos de entidades relacionadas
    private Long unitId;
    private String unitProductGtin;
    private String unitBatch;
    private Long userId;
    private String userName;

    // Não faltam as entidades pai? Unit e User
//    private Unit unit;
//    private User user;
*/
/*
productId: number;
    batch: string;
    type: 'Entrada' | 'Saída';
    quantity: number;
    containerId: number;
    sourceType: string;
    sourceDetails: string;
    expiration_date: Date;
    price: number;
    userId: number;
*/
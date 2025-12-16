-- Inserts para tbl_category (Corrigido cat_type para corresponder ao Enum FoodType)
INSERT INTO tbl_category (cat_description, cat_createdAt, cat_updatedAt, cat_type)
VALUES
('Arroz integral', NOW(), NOW(), 'NAO_PERECIVEL'), -- Ajuste o valor se o Enum for diferente
('Leite integral', NOW(), NOW(), 'NAO_PERECIVEL'),
('Feijão preto', NOW(), NOW(), 'NAO_PERECIVEL'),
('Suco de uva', NOW(), NOW(), 'NAO_PERECIVEL');

-- Inserts para tbl_container (OK)
INSERT INTO tbl_container (con_code, con_description, con_type)
VALUES
('CONT-ARZ01', 'Container Arroz 1', 'STORAGE'),
('CONT-LEI01', 'Container Leite 1', 'STORAGE'),
('CONT-FEJ01', 'Container Feijão 1', 'STORAGE'),
('CONT-SUC01', 'Container Suco 1', 'STORAGE'),
('COZINHA-01', 'Cozinha Principal', 'PREPARATION'),
('DESCARTE-01', 'Área de Descarte', 'DISPOSAL');

-- Inserts para tbl_category_container (OK, mas verifique a necessidade)
INSERT INTO tbl_category_container (fk_tbl_category_cat_id, fk_tbl_container_con_id)
VALUES
(1, 1), (2, 2), (3, 3), (4, 4);

-- Inserts para tbl_product (OK)
INSERT INTO tbl_product (pdt_gtin, pdt_measure, pdt_measureType, pdt_createdAt, pdt_updatedAt, fk_tbl_category_cat_id)
VALUES
('7891000000001', 5, 'kg', NOW(), NOW(), 1),
('7892000000002', 1, 'L', NOW(), NOW(), 2),
('7893000000003', 1, 'kg', NOW(), NOW(), 3),
('7894000000004', 1.5, 'L', NOW(), NOW(), 4);

-- Inserts para tbl_unit (Corrigido nome da coluna unt_expirationDate)
INSERT INTO tbl_unit (unt_batch, unt_expirationDate, unt_quantity, unt_price, fk_tbl_container_con_id, fk_tbl_product_pdt_id)
VALUES
('ARZ2025A', '2025-12-01', 50, 2290, 1, 1), -- Preço em centavos (22.90 * 100)
('ARZ2025B', '2026-01-15', 30, 2350, 1, 1),
('LEI2025A', '2025-06-30', 100, 475, 2, 2),
('FEJ2026A', '2026-12-31', 80, 990, 3, 3),
('SUC2025A', '2025-09-15', 60, 750, 4, 4),
('SUC2025B', '2025-10-10', 40, 800, 4, 4);

-- Inserts para tbl_user (Corrigido nome da tabela, placeholders para senha, ajuste roles se necessário)
INSERT INTO tbl_user (us_name, us_password, us_role)
VALUES
('João Silva', '123', 'ADMINISTRADOR'), -- Substitua pelo hash real com prefixo {bcrypt}
('Maria Souza', '123', 'ESTOQUISTA'),
('Carlos Lima', '123', 'COZINHEIRO'),
('Ana Paula', '123', 'ADMINISTRADOR');

-- Inserts para tbl_movement (Corrigido sourceType para corresponder ao Enum InputSourceType)
INSERT INTO tbl_movement (mov_quantity, mov_type, mov_origin, mov_destiny, mov_date, fk_tbl_unit_unt_id, fk_tbl_user_us_id, mov_source_type, mov_source_details)
VALUES
(20, 'ENTRADA', null, 'CONT-ARZ01', NOW(), 1, 1, 'DOACAO', 'Supermercado X');

INSERT INTO tbl_movement (mov_quantity, mov_type, mov_origin, mov_destiny, mov_date, fk_tbl_unit_unt_id, fk_tbl_user_us_id)
VALUES
(10, 'SAIDA', 'CONT-ARZ01', 'COZINHA-01', NOW(), 1, 2);

INSERT INTO tbl_movement (mov_quantity, mov_type, mov_origin, mov_destiny, mov_date, fk_tbl_unit_unt_id, fk_tbl_user_us_id, mov_source_type, mov_source_details)
VALUES
(15, 'ENTRADA', null, 'CONT-ARZ01', NOW(), 2, 3, 'COMPRA_PROPRIA', 'Atacadão Y');

INSERT INTO tbl_movement (mov_quantity, mov_type, mov_origin, mov_destiny, mov_date, fk_tbl_unit_unt_id, fk_tbl_user_us_id, mov_source_type, mov_source_details)
VALUES
(50, 'ENTRADA', null, 'CONT-LEI01', NOW(), 3, 2, 'COMPRA_PROPRIA', 'Fornecedor Z');

INSERT INTO tbl_movement (mov_quantity, mov_type, mov_origin, mov_destiny, mov_date, fk_tbl_unit_unt_id, fk_tbl_user_us_id)
VALUES
(30, 'SAIDA', 'CONT-FEJ01', 'DESCARTE-01', NOW(), 4, 4);

INSERT INTO tbl_movement (mov_quantity, mov_type, mov_origin, mov_destiny, mov_date, fk_tbl_unit_unt_id, fk_tbl_user_us_id, mov_source_type, mov_source_details)
VALUES
(25, 'ENTRADA', null, 'CONT-SUC01', NOW(), 5, 1, 'DOACAO', 'Empresa W');

INSERT INTO tbl_movement (mov_quantity, mov_type, mov_origin, mov_destiny, mov_date, fk_tbl_unit_unt_id, fk_tbl_user_us_id)
VALUES
(20, 'SAIDA', 'CONT-SUC01', 'COZINHA-01', NOW(), 6, 3);

-- Inserts para tbl_order (OK)
INSERT INTO tbl_order (ord_requester_name, ord_date, ord_status, fk_tbl_user_us_id)
VALUES
('Nutricionista Ana', NOW(), 'PENDENTE', 4),
('Cozinheira Maria', '2025-09-20 00:00:00', 'ATENDIDO', 2); -- Ajuste para timestamp se a coluna for timestamp

-- Inserts para tbl_order_item (OK)
INSERT INTO tbl_order_item (ori_quantity_requested, ori_quantity_fulfilled, fk_tbl_order_ord_id, fk_tbl_product_pdt_id)
VALUES
(10, 0, 1, 3),
(15, 0, 1, 4),
(5, 5, 2, 1);

-- Exemplo de Movimentação vinculada a um Item de Pedido (OK)
INSERT INTO tbl_movement (mov_quantity, mov_type, mov_origin, mov_destiny, mov_date, fk_tbl_unit_unt_id, fk_tbl_user_us_id, fk_tbl_order_item_ori_id)
VALUES
(5, 'SAIDA', 'CONT-ARZ01', 'COZINHA-01', '2025-09-21 00:00:00', 1, 3, 3); -- Ajuste para timestamp se a coluna for timestamp
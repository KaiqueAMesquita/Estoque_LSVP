package com.lsvp.InventoryManagement.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "tbl_unit")
@Data
public class Unit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "unt_id")
    private Long id;

    @Column(name = "unt_batch", length = 30, nullable = false)
    private String batch;

    @Column(name = "unt_expirationDate", nullable = false)
    private LocalDate expiration_date;

    @Column(name = "unt_quantity", nullable = false)
    private int quantity;

    // Lucas: Coloquei price como int pela falta de precisão em contas com números decimais
    // Ao realizar operações, usa-se o int. Ao exibir para o usuário, basta dividir por 100.
    @Column(name = "unt_price", nullable = false)
    private int price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_tbl_container_con_id")
    private Container container;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_tbl_product_pdt_id")
    private Product product;
}

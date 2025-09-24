package com.lsvp.InventoryManagement.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "tbl_order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ori_id")
    private Long id;

    @Column(name = "ori_quantity_requested", nullable = false)
    private int quantityRequest;

    @Column(name = "ori_quantity_fulfilled")
    private int quantityFulfilled;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_tbl_order_ord_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_tbl_product_pdt_id", nullable = false)
    private Product product;
}

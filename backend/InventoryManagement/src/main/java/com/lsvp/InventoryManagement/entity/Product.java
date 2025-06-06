package com.lsvp.InventoryManagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GeneratedColumn;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_product")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pdt_id")
    private Long id;

    @Column(name = "pdt_gtin", length = 50, nullable = false)
    private String gtin;

    //https://docs.oracle.com/javaee/6/api/javax/persistence/Column.html
    @Column(name = "pdt_measure", precision = 6, scale = 3, nullable = false)
    private BigDecimal measure;

    @Column(name = "pdt_measureType", nullable = false)
    private String measureType;

    @Column(name = "pdt_createdAt", nullable = false)
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime createdAt;

    @Column(name = "pdt_updatedAt", nullable = true)
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime updatedAt;

    //https://www.baeldung.com/hibernate-one-to-many
    @ManyToOne
    @JoinColumn(name = "fk_tbl_category_cat_id")
    private Category category;

}

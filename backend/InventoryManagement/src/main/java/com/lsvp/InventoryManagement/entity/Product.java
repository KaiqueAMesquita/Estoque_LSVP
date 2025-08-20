package com.lsvp.InventoryManagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.GeneratedColumn;
import org.springframework.format.annotation.DateTimeFormat;

import com.lsvp.InventoryManagement.enums.MeasureType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "tbl_product")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pdt_id")
    private Long id;

    @Column(name = "pdt_gtin", length = 50, nullable = false, unique = true)
    private String gtin;

    //https://docs.oracle.com/javaee/6/api/javax/persistence/Column.html
    @Column(name = "pdt_measure", precision = 6, scale = 3, nullable = false)
    private BigDecimal measure;

    @Enumerated(EnumType.STRING)
    @Column(name = "pdt_measureType", nullable = false)
    private MeasureType measureType;

    @Column(name = "pdt_createdAt", nullable = false)
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime createdAt;

    @Column(name = "pdt_updatedAt", nullable = true)
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm")
    private LocalDateTime updatedAt;

    //https://www.baeldung.com/hibernate-one-to-many
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_tbl_category_cat_id")
    // Lucas: NÃO MEXA nessas duas linhas abaixo se valoriza sua vida e sanidade
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Category category;

    @OneToMany(mappedBy = "product")
    private Set<Unit> units;
}

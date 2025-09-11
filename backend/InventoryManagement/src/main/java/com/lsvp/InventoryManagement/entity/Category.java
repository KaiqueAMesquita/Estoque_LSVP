package com.lsvp.InventoryManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lsvp.InventoryManagement.enums.FoodType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Table(name = "tbl_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cat_id")
    private Long id;

    @Column(name = "cat_description", length = 50, nullable = false)
    private String description;

    @Column(name = "cat_createdAt", nullable = false)
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime created_at;

    @Column(name = "cat_updatedAt", nullable = true)
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime updated_at;

    @Column(name = "cat_type", length = 30, nullable = false)
    private FoodType food_type;

    @Column(name = "cat_min_quantity", nullable = true)
    private int min_quantity;

    @Column(name = "cat_max_quantity", nullable = true)
    private int max_quantity;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    // Lucas: NÃO MEXA nessas duas linhas abaixo se valoriza sua vida e sanidade
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Product> products;
}

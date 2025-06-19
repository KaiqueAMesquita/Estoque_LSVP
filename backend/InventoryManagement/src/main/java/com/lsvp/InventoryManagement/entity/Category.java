package com.lsvp.InventoryManagement.entity;

import com.lsvp.InventoryManagement.enums.FoodType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Table(name = "categories")
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
}

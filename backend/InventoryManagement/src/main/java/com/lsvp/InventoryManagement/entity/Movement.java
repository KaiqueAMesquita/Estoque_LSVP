package com.lsvp.InventoryManagement.entity;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.lsvp.InventoryManagement.enums.MovementType;
import com.lsvp.InventoryManagement.enums.ProductSource;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_movement")
@Data
public class Movement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mov_id")
    private Long id;

    @Column(name = "mov_quantity", nullable = false)
    private int quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "mov_type", length = 30, nullable = false)
    private MovementType type;

    @Column(name = "mov_origin", length = 30, nullable = true)
    private String origin;

    @Column(name = "mov_destiny", length = 30, nullable = false)
    private String destiny;

    @Column(name = "mov_date", nullable = false)
    @DateTimeFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    @Column(name = "mov_source_type")
    private ProductSource sourceType;

    @Column(name = "mov_source_details")
    private String sourceDetails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_tbl_unit_unt_id")
    private Unit unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_tbl_user_us_id")
    private User user;

}

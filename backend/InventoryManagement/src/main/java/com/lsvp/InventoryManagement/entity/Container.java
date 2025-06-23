package com.lsvp.InventoryManagement.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tbl_container")
@Data
public class Container {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "con_id")
    private Long id;

    @Column(name = "con_code", length = 20, unique = true)
    private String code;

}

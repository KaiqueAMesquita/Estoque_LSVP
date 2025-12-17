package com.lsvp.InventoryManagement.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.Set;

import com.lsvp.InventoryManagement.enums.ContainerType;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "con_type", length = 20, nullable = false)
    private ContainerType type;

    @Column(name = "con_description", length = 100)
    private String description;

    @OneToMany(mappedBy = "container", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Unit> units;
}

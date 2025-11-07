package com.lsvp.InventoryManagement.dto.Container;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.enums.ContainerType;

import lombok.Data;

import java.util.Set;

@Data
public class ContainerDTO {
    private Long id;
    private String code;
    private String description;
    private ContainerType type;

    @JsonIgnore
    private Set<Unit> units;
}

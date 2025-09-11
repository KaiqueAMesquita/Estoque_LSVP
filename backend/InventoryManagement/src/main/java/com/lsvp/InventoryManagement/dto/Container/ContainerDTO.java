package com.lsvp.InventoryManagement.dto.Container;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lsvp.InventoryManagement.entity.Unit;
import lombok.Data;

import java.util.Set;

@Data
public class ContainerDTO {
    private Long id;
    private String code;

    @JsonIgnore
    private Set<Unit> units;
}

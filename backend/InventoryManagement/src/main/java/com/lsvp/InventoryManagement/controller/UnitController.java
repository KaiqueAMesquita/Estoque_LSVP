package com.lsvp.InventoryManagement.controller;

import com.lsvp.InventoryManagement.dto.Unit.*;
import com.lsvp.InventoryManagement.service.UnitService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Unidades", description = "Gerenciamento de Unidades")

@RequestMapping("api/unit")
public class UnitController {

    @Autowired
    private UnitService unitService;

    // @PostMapping
    // public ResponseEntity<UnitDTO> createProduct(@Valid @RequestBody UnitCreateDTO dto){

    //     return ResponseEntity.ok(unitService.createUnit(dto));
    // }

    @GetMapping
    public ResponseEntity<List<UnitDTO>> getAllUnits(){
        return ResponseEntity.ok(unitService.getAllUnits());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UnitDTO> getUnitById(@PathVariable Long id){
        return ResponseEntity.ok(unitService.getUnitById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnitDTO> updateUnit(@PathVariable Long id, @Valid @RequestBody UnitUpdateDTO dto){

        return ResponseEntity.ok(unitService.updateUnit(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUnit(@PathVariable Long id){

        unitService.deleteUnit(id);

        return ResponseEntity.ok().build();
    }
    
}

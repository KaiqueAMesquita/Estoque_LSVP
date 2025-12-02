package com.lsvp.InventoryManagement.controller;

import com.lsvp.InventoryManagement.dto.Unit.*;
import com.lsvp.InventoryManagement.service.UnitService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.List;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Page<UnitDTO>> getAllUnits(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long containerId 
    ) {
        Page<UnitDTO> result = unitService.getAllUnitsSorted(page, limit, sort, productId, containerId);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UnitDTO> getUnitById(@PathVariable Long id){
        return ResponseEntity.ok(unitService.getUnitById(id));
    }

    @GetMapping("/batch/{batch}")
    public ResponseEntity<UnitDTO> getUnitByBatch(@PathVariable String batch){
        return ResponseEntity.ok(unitService.getUnitByBatch(batch));
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

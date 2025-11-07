package com.lsvp.InventoryManagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lsvp.InventoryManagement.dto.Kitchen.KitchenUnitDTO;
import com.lsvp.InventoryManagement.service.KitchenService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/kitchen")
@Tag(name = "Cozinha", description = "Consultas sobre o estoque na cozinha")
public class KitchenController {


    @Autowired
    private KitchenService kitchenService;

    @GetMapping("/units")
    public ResponseEntity<Page<KitchenUnitDTO>> getKitchenUnits(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<KitchenUnitDTO> result = kitchenService.getKitchenUnits(page, limit);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/units/expiring-soon")
    public ResponseEntity<Page<KitchenUnitDTO>> getExpiringSoonUnits(
            @RequestParam(defaultValue = "7") int thresholdDays,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<KitchenUnitDTO> result = kitchenService.getExpiringSoonUnits(thresholdDays, page, limit);
        return ResponseEntity.ok(result);
    }

}

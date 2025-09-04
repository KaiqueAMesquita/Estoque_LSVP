package com.lsvp.InventoryManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lsvp.InventoryManagement.dto.Movement.MovementCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.MovementDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductCreateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.service.MovementService;


import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@Tag(name = "Movements", description = "Gerenciamento das Movimentações")
@RequestMapping("api/movement")
public class MovementController {

    @Autowired
    private MovementService movementService;

    @PostMapping
        public ResponseEntity<MovementDTO> createMovement(@Valid @RequestBody MovementCreateDTO dto){
            return ResponseEntity.ok(movementService.createMovement(dto));
        }

        @GetMapping
        public ResponseEntity<List<MovementDTO>> getAllMovements(){
            return ResponseEntity.ok(movementService.getAllMovements());
        }
        
        @GetMapping("/{id}")
        public ResponseEntity<MovementDTO> getProductById(@PathVariable Long id){
            return ResponseEntity.ok(movementService.getMovementById(id));
        }
}

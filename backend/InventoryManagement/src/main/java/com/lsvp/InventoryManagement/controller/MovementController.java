package com.lsvp.InventoryManagement.controller;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lsvp.InventoryManagement.dto.Movement.ConsumptionCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.InputCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.MovementCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.MovementDTO;
import com.lsvp.InventoryManagement.dto.Movement.OutputCreateDTO;
import com.lsvp.InventoryManagement.dto.Movement.StockAdjustmentDTO;
import com.lsvp.InventoryManagement.dto.Movement.TransferCreateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductCreateDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.enums.MovementType;
import com.lsvp.InventoryManagement.service.MovementService;


import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@Tag(name = "Movements", description = "Gerenciamento das Movimentações")
@RequestMapping("api/movement")
public class MovementController {

    @Autowired
    private MovementService movementService;

    @PostMapping("/inputs")
    //@PreAuthorize("hasRole('STOCKER')")
        public ResponseEntity<MovementDTO> createInput(@Valid @RequestBody InputCreateDTO dto){
            return ResponseEntity.ok(movementService.createInput(dto));
        }
    
    @PostMapping("/outputs")
    //@PreAuthorize("hasRole('STOCKER')")
        public ResponseEntity<MovementDTO> createOutput(@Valid @RequestBody OutputCreateDTO dto){
            return ResponseEntity.ok(movementService.createOutput(dto));
        }

    @PostMapping("/transfers")
    //@PreAuthorize("hasRole('STOCKER')")
        public ResponseEntity<MovementDTO> createTransfer(@Valid @RequestBody TransferCreateDTO dto){
            return ResponseEntity.ok(movementService.createTransfer(dto));
        }

    @PostMapping("/consumption")
    public ResponseEntity<MovementDTO> createConsumption(@Valid @RequestBody ConsumptionCreateDTO dto) {
        MovementDTO movement = movementService.createConsumption(dto);
        return ResponseEntity.ok(movement);
    }


    @PostMapping("/adjustments/output")
    public ResponseEntity<MovementDTO> createOutputAdjustment(@Valid @RequestBody StockAdjustmentDTO dto) {
        MovementDTO movement = movementService.createOutputAdjustment(dto);
        return ResponseEntity.ok(movement);
    }

    
    @GetMapping
        public ResponseEntity<Page<MovementDTO>> getAllMovements(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "date,desc") String sort
        ){
            Page<MovementDTO> result = movementService.getAllMovementsSorted(page, limit, sort);
            return ResponseEntity.ok(result);
        }

    @GetMapping("/inputs")
    public ResponseEntity<Page<MovementDTO>> getInputs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "date,desc") String sort,
            @RequestParam(required = false) Long unitId
    ){
        Page<MovementDTO> result = movementService.getMovementsByTypeSorted(MovementType.ENTRADA, page, limit, sort, unitId, null);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/outputs")
    public ResponseEntity<Page<MovementDTO>> getOutputs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "date,desc") String sort,
            @RequestParam(required = false) Long unitId
    ){
        Page<MovementDTO> result = movementService.getMovementsByTypeSorted(MovementType.SAIDA, page, limit, sort, unitId, null);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/adjustments/output")
    public ResponseEntity<Page<MovementDTO>> getOutputAdjustments(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "date,desc") String sort
    ){
        Page<MovementDTO> result = movementService.getOutputAdjustmentsSorted(page, limit, sort, null);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/transfers")
    public ResponseEntity<Page<MovementDTO>> getTransfers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "date,desc") String sort,
            @RequestParam(required = false) Long unitId
    ){
        Page<MovementDTO> result = movementService.getTransfersSorted(page, limit, sort, unitId);
        return ResponseEntity.ok(result);
    }

    
    @GetMapping("/{id}")
        public ResponseEntity<MovementDTO> getMovementById(@PathVariable Long id){
            return ResponseEntity.ok(movementService.getMovementById(id));
        }
}

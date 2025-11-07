package com.lsvp.InventoryManagement.controller;


import com.lsvp.InventoryManagement.dto.Container.*;
import com.lsvp.InventoryManagement.dto.Product.ProductDTO;
import com.lsvp.InventoryManagement.dto.Product.ProductUpdateDTO;
import com.lsvp.InventoryManagement.service.ContainerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@Tag(name = "Conteiners", description = "Gerenciamento dos Conteiners")

@RequestMapping("api/container")
public class ContainerController {

    @Autowired
    ContainerService containerService;


    @PostMapping
    public ResponseEntity<ContainerDTO> createContainer(@Valid @RequestBody ContainerCreateDTO dto){
        return ResponseEntity.ok(containerService.createContainer(dto));
    }

    @GetMapping
    public ResponseEntity<Page<ContainerDTO>> getAllContainers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(defaultValue = "id,desc") String sort,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String category
    ){
        Page<ContainerDTO> result = containerService.getAllContainersSorted(page, limit, sort, code, category);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContainerDTO> getContainerById(@PathVariable Long id){
        return ResponseEntity.ok(containerService.getContainerById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContainerDTO> updateContainer(@PathVariable Long id, @Valid @RequestBody ContainerUpdateDTO dto){
        return ResponseEntity.ok(containerService.updateContainer(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContainer(@PathVariable Long id){

        containerService.deleteContainer(id);

        return ResponseEntity.ok().build();
    }


}

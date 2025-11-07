package com.lsvp.InventoryManagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lsvp.InventoryManagement.dto.Dashboard.KitchenProductCountDTO;
import com.lsvp.InventoryManagement.service.DashboardService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard", description = "Consultas para o dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/kitchen/product-count")
    public ResponseEntity<KitchenProductCountDTO> getKitchenProductCount() {
        return ResponseEntity.ok(dashboardService.getKitchenProductCount());
    }
}

package com.lsvp.InventoryManagement.service;

import com.lsvp.InventoryManagement.repository.IUnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UnitService {
    @Autowired
    private IUnitRepository repository;

    // Create -> toSummary
    // ReadById
    // ReadAll -> toSummary
    // Update
    // Delete
}

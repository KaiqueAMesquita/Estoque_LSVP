package com.lsvp.InventoryManagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lsvp.InventoryManagement.dto.Dashboard.KitchenProductCountDTO;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.enums.ContainerType;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.repository.IContainerRepository;
import com.lsvp.InventoryManagement.repository.IUnitRepository;

@Service
public class DashboardService {

    @Autowired
    private IUnitRepository unitRepository;

    @Autowired
    private IContainerRepository containerRepository;

    private Container getKitchenContainer() {
        return containerRepository.findByType(ContainerType.PREPARACAO)
                .orElseThrow(() -> new ResourceNotFoundException("Container do tipo PREPARATION (Cozinha) não encontrado!"));
    }

    @Transactional(readOnly = true)
    public KitchenProductCountDTO getKitchenProductCount() {
        Container kitchen = getKitchenContainer();
        long count = unitRepository.countDistinctProductsByContainerAndQuantityGreaterThan(kitchen);
        return new KitchenProductCountDTO(count);
    }


}

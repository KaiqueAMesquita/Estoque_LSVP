package com.lsvp.InventoryManagement.repository;

import com.lsvp.InventoryManagement.entity.Container;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IContainerRepository extends JpaRepository<Container, Long> {
    void deleteById(Long id);
}

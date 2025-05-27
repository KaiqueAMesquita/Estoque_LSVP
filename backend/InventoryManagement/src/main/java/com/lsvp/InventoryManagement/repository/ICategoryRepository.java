package com.lsvp.InventoryManagement.repository;

import com.lsvp.InventoryManagement.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICategoryRepository extends JpaRepository <Category, Long> {
    void deleteById(Long id);
}

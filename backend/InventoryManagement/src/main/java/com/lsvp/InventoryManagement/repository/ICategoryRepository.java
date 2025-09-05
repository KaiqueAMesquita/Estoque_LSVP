package com.lsvp.InventoryManagement.repository;

import com.lsvp.InventoryManagement.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ICategoryRepository extends JpaRepository <Category, Long> {
    void deleteById(Long id);

    // Esses dois métodos evitam ConcurrentModificationError
    // @Query("SELECT DISTINCT c FROM Category c LEFT JOIN FETCH c.products")
    // List<Category> findAllWithProducts();

    // @Query("SELECT c FROM Category c LEFT JOIN FETCH c.products WHERE c.id = :id")
    // Optional<Category> findByIdWithProducts(@Param("id") Long id);
}

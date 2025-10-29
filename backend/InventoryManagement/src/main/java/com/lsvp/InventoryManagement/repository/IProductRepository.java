package com.lsvp.InventoryManagement.repository;

import com.lsvp.InventoryManagement.entity.Product;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface IProductRepository extends JpaRepository<Product, Long> {
     Optional<Product> findByGtin(String gtin);

     Page<Product> findByCategory_DescriptionContainingIgnoreCase(String description, Pageable pageable);

     Page<Product> findByGtin(String gtin, Pageable pageable);
}

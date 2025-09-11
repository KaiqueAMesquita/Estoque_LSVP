package com.lsvp.InventoryManagement.repository;

import com.lsvp.InventoryManagement.entity.Product;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface IProductRepository extends JpaRepository<Product, Long> {
     Optional<Product> findByGtin(String gtin);
}

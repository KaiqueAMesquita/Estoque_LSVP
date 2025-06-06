package com.lsvp.InventoryManagement.repository;

import com.lsvp.InventoryManagement.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IProductRepository extends JpaRepository<Product, Long> {

}

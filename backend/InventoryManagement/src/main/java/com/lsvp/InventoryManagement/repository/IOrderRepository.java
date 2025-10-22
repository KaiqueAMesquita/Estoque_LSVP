package com.lsvp.InventoryManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lsvp.InventoryManagement.entity.Order;

public interface IOrderRepository extends JpaRepository <Order, Long>{

}

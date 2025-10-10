package com.lsvp.InventoryManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lsvp.InventoryManagement.entity.OrderItem;


public interface IOrderItemRepository extends JpaRepository<OrderItem, Long> {

}

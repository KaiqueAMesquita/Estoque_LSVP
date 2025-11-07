package com.lsvp.InventoryManagement.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.lsvp.InventoryManagement.entity.Order;
import com.lsvp.InventoryManagement.enums.OrderStatus;

public interface IOrderRepository extends JpaRepository <Order, Long>{
    // Método para buscar pedidos por uma lista de status (paginado)
    Page<Order> findByStatusIn(List<OrderStatus> statuses, Pageable pageable);

}

package com.lsvp.InventoryManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lsvp.InventoryManagement.dto.Fulfillment.FulfillmentRequestDTO;
import com.lsvp.InventoryManagement.dto.Order.OrderCreateDTO;
import com.lsvp.InventoryManagement.dto.Order.OrderDTO;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("api/orders")
@Tag(name = "Orders", description = "Gerenciamento de Pedidos de Unidades")
public class OrderController {

    // @Autowired
    // private OrderService orderService;

    // @PostMapping
    // public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderCreateDTO dto) {

    //     return ResponseEntity.ok(orderService.createOrder(dto));
    // }

    // @PostMapping("/{id}/fulfill")
    // public ResponseEntity<Void> fulfillOrder(@PathVariable Long id, @Valid @RequestBody FulfillmentRequestDTO dto) {
    //     orderService.fulfillOrder(id, dto);
    //     return ResponseEntity.ok().build();
    // }

    // @GetMapping
    // public ResponseEntity <List<OrderDTO>> getAllOrders(){
    //     return ResponseEntity.ok(orderService.getAllOrders());
    // }

    // @GetMapping("/{id}")
    // public ResponseEntity <OrderDTO> getOrderById(@PathVariable Long id){
    //     return ResponseEntity.ok(orderService.getOrderById(id));
    // }

    
    
    


}

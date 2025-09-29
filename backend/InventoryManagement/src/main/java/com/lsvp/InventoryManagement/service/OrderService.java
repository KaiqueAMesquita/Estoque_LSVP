package com.lsvp.InventoryManagement.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lsvp.InventoryManagement.dto.Order.OrderCreateDTO;
import com.lsvp.InventoryManagement.dto.Order.OrderDTO;
import com.lsvp.InventoryManagement.dto.OrderItem.OrderItemCreateDTO;
import com.lsvp.InventoryManagement.entity.Order;
import com.lsvp.InventoryManagement.entity.OrderItem;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.enums.OrderStatus;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IOrderMapper;
import com.lsvp.InventoryManagement.repository.IOrderRepository;
import com.lsvp.InventoryManagement.repository.IProductRepository;
import com.lsvp.InventoryManagement.repository.IUserRepository;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IOrderMapper mapper;
    
    @Autowired
    private MovementService movementService;

    @Transactional
    public OrderDTO createOrder(OrderCreateDTO dto){
        User user = userRepository.findById(dto.getUserId()).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado!!!"));

        Order order = new Order();
        order.setRequesterName(dto.getRequesterName());
        order.setUser(user);
        order.setDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDENDTE);

        List<OrderItem> items = new ArrayList<>();
        for (OrderItemCreateDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado!!!"));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantityRequest(itemDto.getQuantityRequested());
            orderItem.setQuantityFulfilled(0);
            orderItem.setOrder(order);
            items.add(orderItem);
        }

        order.setItems(items);

        return mapper.toDTO(orderRepository.save(order));
    }

    public OrderDTO getOrderById(Long id){
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado!!!"));

        return mapper.toDTO(order);
    }

    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(mapper::toDTO).collect(Collectors.toList());
    }
}

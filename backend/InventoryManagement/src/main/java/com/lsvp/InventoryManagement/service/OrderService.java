package com.lsvp.InventoryManagement.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lsvp.InventoryManagement.dto.Fulfillment.FulfillmentItemDTO;
import com.lsvp.InventoryManagement.dto.Fulfillment.FulfillmentRequestDTO;
import com.lsvp.InventoryManagement.dto.Movement.OutputCreateDTO;
import com.lsvp.InventoryManagement.dto.Order.OrderCreateDTO;
import com.lsvp.InventoryManagement.dto.Order.OrderDTO;
import com.lsvp.InventoryManagement.dto.OrderItem.OrderItemCreateDTO;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Order;
import com.lsvp.InventoryManagement.entity.OrderItem;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.enums.OrderStatus;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IOrderMapper;
import com.lsvp.InventoryManagement.repository.IContainerRepository;
import com.lsvp.InventoryManagement.repository.IOrderRepository;
import com.lsvp.InventoryManagement.repository.IProductRepository;
import com.lsvp.InventoryManagement.repository.IUserRepository;
import java.util.Arrays;
import org.springframework.data.domain.Sort;


@Service
public class OrderService {

    @Autowired
    private IOrderRepository orderRepository;

    @Autowired
    private IProductRepository productRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IContainerRepository containerRepository;

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
        order.setStatus(OrderStatus.PENDENTE);

        List<OrderItem> items = new ArrayList<>();
        for (OrderItemCreateDTO itemDto : dto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado!!!"));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantityRequested(itemDto.getQuantityRequested());
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

    @Transactional
    public void fulfillOrder(Long orderId, FulfillmentRequestDTO dto) {

        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado!"));

        Container destinationContainer = containerRepository.findByCode(dto.getDestination())
            .orElseThrow(() -> new ResourceNotFoundException("Container/Localização de destino '" + dto.getDestination() + "' não encontrado!"));
    
        Long destinationContainerId = destinationContainer.getId();

        for (FulfillmentItemDTO itemFulfillment : dto.getFulfillments()) {
           
            OutputCreateDTO outputDto = new OutputCreateDTO();
            outputDto.setUnitId(itemFulfillment.getUnitId());
            outputDto.setQuantity(itemFulfillment.getQuantity());
            outputDto.setDestinationContainerId(destinationContainerId);
            outputDto.setUserId(dto.getUserId());
            outputDto.setOrderItemId(itemFulfillment.getOrderItemId()); 

            movementService.createOutput(outputDto);
        }

        // Após processar todas as saídas, atualiza o status geral do pedido
        updateOrderStatus(order);
    }

    private void updateOrderStatus(Order order) {
        // Recarrega o pedido para pegar os dados atualizados dos itens
        Order updatedOrder = orderRepository.findById(order.getId()).get();
        boolean allItemsFulfilled = true;
        
        for (OrderItem item : updatedOrder.getItems()) {
            if (item.getQuantityFulfilled() < item.getQuantityRequested()) {
                allItemsFulfilled = false;
                break;
            }
        }

        if (allItemsFulfilled) {
            updatedOrder.setStatus(OrderStatus.ATENDIDO);
        } else {
            updatedOrder.setStatus(OrderStatus.ATENDIDO_PARCIALMENTE);
        }
        orderRepository.save(updatedOrder);
    }

    @Transactional(readOnly = true)
    public Page<OrderDTO> getPendingOrders(int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("date").descending()); // Ordena por data descendente
        List<OrderStatus> statuses = Arrays.asList(OrderStatus.PENDENTE, OrderStatus.ATENDIDO_PARCIALMENTE);
        Page<Order> ordersPage = orderRepository.findByStatusIn(statuses, pageable);
        List<OrderDTO> dtos = ordersPage.stream().map(mapper::toDTO).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, ordersPage.getTotalElements());
    }


    @Transactional(readOnly = true)
    public Page<OrderDTO> getAllOrdersSorted(int page, int limit, String sortParam) {
        // Lógica para parsear o sortParam (ex: "date,desc")
        String[] sortParts = sortParam.split(",");
        String property = sortParts[0];
        Sort.Direction direction = (sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(direction, property));

        Page<Order> ordersPage = orderRepository.findAll(pageable);
        List<OrderDTO> dtos = ordersPage.stream().map(mapper::toDTO).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, ordersPage.getTotalElements());
    }
}

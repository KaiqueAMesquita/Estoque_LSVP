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
import com.lsvp.InventoryManagement.dto.Fulfillment.FulfillmentSuggestionDTO;
import com.lsvp.InventoryManagement.dto.Fulfillment.SuggestedUnitDTO;
import com.lsvp.InventoryManagement.dto.Movement.OutputCreateDTO;
import com.lsvp.InventoryManagement.dto.Order.OrderCreateDTO;
import com.lsvp.InventoryManagement.dto.Order.OrderDTO;
import com.lsvp.InventoryManagement.dto.OrderItem.OrderItemCreateDTO;
import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Order;
import com.lsvp.InventoryManagement.entity.OrderItem;
import com.lsvp.InventoryManagement.entity.Product;
import com.lsvp.InventoryManagement.entity.Unit;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.enums.ContainerType;
import com.lsvp.InventoryManagement.enums.OrderStatus;
import com.lsvp.InventoryManagement.exceptions.BusinessException;
import com.lsvp.InventoryManagement.exceptions.ResourceNotFoundException;
import com.lsvp.InventoryManagement.mapper.IOrderMapper;
import com.lsvp.InventoryManagement.repository.ICategoryRepository;
import com.lsvp.InventoryManagement.repository.IContainerRepository;
import com.lsvp.InventoryManagement.repository.IOrderRepository;
import com.lsvp.InventoryManagement.repository.IProductRepository;
import com.lsvp.InventoryManagement.repository.IUnitRepository;
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
    private IUnitRepository unitRepository;

    @Autowired
    private IContainerRepository containerRepository;

    @Autowired
    private ICategoryRepository categoryRepository;

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
            Category category = categoryRepository.findById(itemDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada!!! ID: " + itemDto.getCategoryId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setCategory(category);
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
           
            // 1. Busca o item do pedido original (que pediu uma Categoria específica)
            OrderItem orderItem = order.getItems().stream()
                    .filter(item -> item.getId().equals(itemFulfillment.getOrderItemId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Item do pedido não encontrado no pedido ID: " + orderId));

            // 2. Busca a Unidade física que o usuário escolheu para atender
            Unit unit = unitRepository.findById(itemFulfillment.getUnitId())
                    .orElseThrow(() -> new ResourceNotFoundException("Unidade de estoque não encontrada ID: " + itemFulfillment.getUnitId()));

            // --- VALIDAÇÃO CRÍTICA ---
            // Verifica se a Categoria do Produto da Unidade escolhida é a mesma Categoria solicitada no Pedido
            // Ex: Pediu "Arroz" (Cat ID 1). Unidade é "Arroz Tio João" (Cat ID 1)? OK.
            // Ex: Pediu "Arroz" (Cat ID 1). Unidade é "Feijão" (Cat ID 3)? ERRO.
            if (!unit.getProduct().getCategory().getId().equals(orderItem.getCategory().getId())) {
                throw new BusinessException(
                    String.format("Erro de Compatibilidade: O pedido solicita '%s', mas você selecionou uma unidade de '%s'.", 
                    orderItem.getCategory().getDescription(), 
                    unit.getProduct().getCategory().getDescription())
                );
            }
            // ---------------------------

            OutputCreateDTO outputDto = new OutputCreateDTO();
            outputDto.setUnitId(itemFulfillment.getUnitId());
            outputDto.setQuantity(itemFulfillment.getQuantity());
            outputDto.setDestinationContainerId(destinationContainerId); // Ajuste para int se necessário
            outputDto.setUserId(dto.getUserId());
            outputDto.setOrderItemId(itemFulfillment.getOrderItemId()); 

            movementService.createOutput(outputDto);
        }
        updateOrderStatus(order);
    }

    @Transactional(readOnly = true)
    public List<FulfillmentSuggestionDTO> getFulfillmentSuggestions(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado!"));

        List<FulfillmentSuggestionDTO> suggestions = new ArrayList<>();

        for (OrderItem item : order.getItems()) {
            int quantityNeeded = item.getQuantityRequested() - item.getQuantityFulfilled();
            
            // Se este item já foi atendido, pula
            if (quantityNeeded <= 0) continue;

            FulfillmentSuggestionDTO suggestionForItem = new FulfillmentSuggestionDTO();
            suggestionForItem.setOrderItemId(item.getId());
            // Retorna o ID da Categoria solicitada
            suggestionForItem.setCategoryId(item.getCategory().getId());
            suggestionForItem.setCategoryName(item.getCategory().getDescription());
            suggestionForItem.setQuantityRequested(item.getQuantityRequested());
            suggestionForItem.setQuantityFulfilled(item.getQuantityFulfilled());
            suggestionForItem.setQuantityNeededNow(quantityNeeded);
            suggestionForItem.setSuggestedUnits(new ArrayList<>());
            suggestionForItem.setSufficientStock(false);

            // Busca TODAS as unidades de QUALQUER produto que pertença a esta CATEGORIA
            // Filtrando apenas unidades no ESTOQUE e com saldo positivo
            // Ordenando pela data de validade mais próxima (FEFO)
            List<Unit> availableUnits = unitRepository.findByProduct_Category_IdAndContainer_TypeAndQuantityGreaterThanOrderByExpirationDateAsc(
                    item.getCategory().getId(), 
                    ContainerType.ESTOQUE,
                    0
            );

            int quantityFound = 0;
            
            for (Unit unit : availableUnits) {
                int quantityAvailableInUnit = unit.getQuantity();
                // Calcula quanto pegar desta unidade (o que precisa ou o que tem, o que for menor)
                int quantityToTakeFromThisUnit = Math.min(quantityNeeded - quantityFound, quantityAvailableInUnit);

                if (quantityToTakeFromThisUnit > 0) {
                    SuggestedUnitDTO suggestedUnit = new SuggestedUnitDTO();
                    suggestedUnit.setUnitId(unit.getId());
                    suggestedUnit.setBatch(unit.getBatch());
                    suggestedUnit.setExpirationDate(unit.getExpirationDate());
                    suggestedUnit.setQuantityToTake(quantityToTakeFromThisUnit);
                    suggestedUnit.setAvailableInUnit(quantityAvailableInUnit);
                    suggestedUnit.setContainerCode(unit.getContainer().getCode());
                    
                    // Adiciona informação extra útil: Qual é o produto específico (Ex: Tio João)
                    // Isso ajuda o estoquista a identificar visualmente
                    // (Se o DTO tiver esse campo, se não, pode ignorar)
                

                    suggestionForItem.getSuggestedUnits().add(suggestedUnit);

                    quantityFound += quantityToTakeFromThisUnit;

                    if (quantityFound >= quantityNeeded) {
                        break; // Já achamos o suficiente para este item
                    }
                }
            }
            
            if (quantityFound >= quantityNeeded) {
                suggestionForItem.setSufficientStock(true);
            }
            
            suggestions.add(suggestionForItem);
        }
        return suggestions;
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

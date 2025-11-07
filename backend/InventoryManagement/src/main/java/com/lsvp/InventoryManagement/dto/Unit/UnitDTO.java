package com.lsvp.InventoryManagement.dto.Unit;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Movement;
import com.lsvp.InventoryManagement.entity.Product;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class UnitDTO {
    private Long id;
    private String batch;
    private LocalDate expiration_date;
    private int quantity;
    // Lucas: Coloquei price como int pela falta de precisão em contas com números decimais
    // Ao realizar operações, usa-se o int. Ao exibir para o usuário, basta dividir por 100.
    private int price;

    //Nome do container
    private String containerCode;

    //Nome do Produto
    private String description;

    //Gtin do Produto
    private String gtin;

    @JsonIgnore
    private Container container;
    @JsonIgnore
    private Product product;
    @JsonIgnore
    private Set<Movement> movements;
}

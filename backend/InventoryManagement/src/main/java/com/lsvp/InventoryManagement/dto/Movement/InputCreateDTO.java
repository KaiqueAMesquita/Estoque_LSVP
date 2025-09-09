package com.lsvp.InventoryManagement.dto.Movement;

import java.time.LocalDate;

import com.lsvp.InventoryManagement.enums.ProductSource;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InputCreateDTO {
    @NotNull
    private Long productId;

    @NotNull
    private String batch;

    @Min(1)
    private int quantity;

    @NotNull
    private Long containerId;

    @NotNull
    private ProductSource sourceType;

    private String sourceDetails;

    @NotNull
    @FutureOrPresent(message = "A data de validade não pode ser no passado")
    private LocalDate expiration_date;

    private int price;

    @NotNull
    private Long userId;
}

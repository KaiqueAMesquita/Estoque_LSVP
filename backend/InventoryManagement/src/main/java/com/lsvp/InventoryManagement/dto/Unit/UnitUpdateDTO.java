package com.lsvp.InventoryManagement.dto.Unit;

import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Product;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
@Schema(description = "DTO para atualização de Unidade")
public class UnitUpdateDTO {
    private String batch;
    private LocalDate expiration_date;
    private int quantity;
    private int price;

    private Long containerId;
    private Long productId;
}

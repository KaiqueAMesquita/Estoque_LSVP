package com.lsvp.InventoryManagement.dto.Unit;

import com.lsvp.InventoryManagement.entity.Container;
import com.lsvp.InventoryManagement.entity.Product;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
@Schema(description = "DTO para atualização de Unidade")
public class UnitUpdateDTO {

    @NotBlank(message = "Lote não pode ser vazio!!")
    private String batch;

    //https://www.baeldung.com/java-validation
    @FutureOrPresent(message = "A data de validade não pode ser no passado")
    private LocalDate expiration_date;
   
    private int price;

}

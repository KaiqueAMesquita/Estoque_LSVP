package com.lsvp.InventoryManagement.mapper;

import com.lsvp.InventoryManagement.dto.CategoryDTO;
import com.lsvp.InventoryManagement.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "Spring")
public interface ICategoryMapper {
    Category toEntity(CategoryDTO dto);
    CategoryDTO toDTO(Category category);
}

package com.lsvp.InventoryManagement.mapper;

import com.lsvp.InventoryManagement.dto.CategoryCreateDTO;
import com.lsvp.InventoryManagement.dto.CategoryDTO;
import com.lsvp.InventoryManagement.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "Spring")
public interface ICategoryMapper {
    Category toEntity(CategoryCreateDTO dto);
    CategoryDTO toDTO(Category category);
}

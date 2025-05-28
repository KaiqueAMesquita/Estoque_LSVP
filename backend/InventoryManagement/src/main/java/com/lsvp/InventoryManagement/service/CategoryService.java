package com.lsvp.InventoryManagement.service;

import com.lsvp.InventoryManagement.dto.CategoryCreateDTO;
import com.lsvp.InventoryManagement.dto.CategoryDTO;
import com.lsvp.InventoryManagement.dto.UserCreateDTO;
import com.lsvp.InventoryManagement.dto.UserDTO;
import com.lsvp.InventoryManagement.entity.Category;
import com.lsvp.InventoryManagement.entity.User;
import com.lsvp.InventoryManagement.mapper.ICategoryMapper;
import com.lsvp.InventoryManagement.repository.ICategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {
    @Autowired
    private ICategoryRepository repository;

    @Autowired
    private ICategoryMapper mapper;

    public CategoryDTO createCategory(CategoryCreateDTO dto)
    {
        Category category = mapper.toEntity(dto);
        return mapper.toDTO(repository.save(category));
    }
}

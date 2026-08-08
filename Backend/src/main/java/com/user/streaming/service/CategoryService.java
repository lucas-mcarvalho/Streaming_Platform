package com.user.streaming.service;

import com.user.streaming.models.Category;
import com.user.streaming.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category create(String name) {
        String normalizedName = name == null ? "" : name.trim();
        if (normalizedName.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O nome da categoria é obrigatório.");
        }
        if (categoryRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Esta categoria já existe.");
        }
        return categoryRepository.save(new Category(normalizedName));
    }

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Set<Category> findAllByIds(Collection<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return new LinkedHashSet<>();
        }

        Set<Long> uniqueIds = new LinkedHashSet<>(categoryIds);
        List<Category> categories = categoryRepository.findAllById(uniqueIds);
        if (categories.size() != uniqueIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Uma ou mais categorias não existem.");
        }
        return new LinkedHashSet<>(categories);
    }
}

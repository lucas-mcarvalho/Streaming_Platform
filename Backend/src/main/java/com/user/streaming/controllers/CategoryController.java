package com.user.streaming.controllers;

import com.user.streaming.dto.CategoryRequestDTO;
import com.user.streaming.models.Category;
import com.user.streaming.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<Category> create(@RequestBody CategoryRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.create(request == null ? null : request.name()));
    }

    @GetMapping
    public ResponseEntity<List<Category>> findAll() {
        return ResponseEntity.ok(categoryService.findAll());
    }
}

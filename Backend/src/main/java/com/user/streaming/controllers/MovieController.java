package com.user.streaming.controllers;

import com.user.streaming.models.Movies;
import com.user.streaming.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Movies> create(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam MultipartFile movie,
            @RequestParam MultipartFile cover,
            @RequestParam(required = false) List<Long> categoryIds) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(movieService.save(title,description, movie, cover, categoryIds));
    }

    @GetMapping
    public ResponseEntity<List<Movies>> findAll(){
        return ResponseEntity.ok(movieService.findAll());
    }
 }

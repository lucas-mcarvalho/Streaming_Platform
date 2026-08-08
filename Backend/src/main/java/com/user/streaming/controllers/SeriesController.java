package com.user.streaming.controllers;

import com.user.streaming.dto.SeriesRequestDTO;
import com.user.streaming.models.Series;
import com.user.streaming.service.SeriesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/series")
public class SeriesController {

    private final SeriesService seriesService;

    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Series> create(@RequestBody SeriesRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(seriesService.create(request));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Series> createWithMedia(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Integer releaseYear,
            @RequestParam MultipartFile cover,
            @RequestParam List<MultipartFile> episodes,
            @RequestParam(required = false) List<Long> categoryIds) {
        return ResponseEntity.status(HttpStatus.CREATED).body(seriesService.createWithMedia(
                title,
                description,
                releaseYear,
                cover,
                episodes,
                categoryIds
        ));
    }

    @GetMapping
    public ResponseEntity<List<Series>> findAll() {
        return ResponseEntity.ok(seriesService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Series> findById(@PathVariable Long id) {
        return ResponseEntity.ok(seriesService.findById(id));
    }
}

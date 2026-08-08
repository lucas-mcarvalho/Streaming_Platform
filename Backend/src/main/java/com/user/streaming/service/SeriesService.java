package com.user.streaming.service;

import com.user.streaming.dto.SeriesRequestDTO;
import com.user.streaming.models.Category;
import com.user.streaming.models.Episode;
import com.user.streaming.models.Series;
import com.user.streaming.repository.SeriesRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class SeriesService {

    private final SeriesRepository seriesRepository;
    private final CategoryService categoryService;

    @Value("${app.storage.location:./storage}")
    private String storageLocation;

    public SeriesService(SeriesRepository seriesRepository, CategoryService categoryService) {
        this.seriesRepository = seriesRepository;
        this.categoryService = categoryService;
    }

    public Series create(SeriesRequestDTO request) {
        validateSeries(request == null ? null : request.title(), request == null ? null : request.releaseYear());

        Series series = new Series();
        series.setTitle(request.title().trim());
        series.setDescription(request.description());
        series.setCoverUrl(request.coverUrl());
        series.setReleaseYear(request.releaseYear());
        series.setCategories(categoryService.findAllByIds(request.categoryIds()));
        return seriesRepository.save(series);
    }

    @Transactional
    public Series createWithMedia(String title,
                                  String description,
                                  Integer releaseYear,
                                  MultipartFile cover,
                                  List<MultipartFile> episodeFiles,
                                  List<Long> categoryIds) {
        validateSeries(title, releaseYear);
        validateFile(cover, "A imagem de capa é obrigatória.");
        if (episodeFiles == null || episodeFiles.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Envie pelo menos um episódio.");
        }
        episodeFiles.forEach(file -> validateFile(file, "Um dos episódios enviados está vazio."));

        Set<Category> categories = categoryService.findAllByIds(categoryIds);

        Series series = new Series();
        series.setTitle(title.trim());
        series.setDescription(description);
        series.setReleaseYear(releaseYear);
        series.setCategories(categories);
        series.setCoverUrl(saveFile(cover, "series/covers"));

        for (int index = 0; index < episodeFiles.size(); index++) {
            MultipartFile episodeFile = episodeFiles.get(index);
            int episodeNumber = index + 1;
            series.addEpisode(new Episode(
                    episodeTitle(episodeFile, episodeNumber),
                    episodeNumber,
                    saveFile(episodeFile, "series/episodes")
            ));
        }

        return seriesRepository.save(series);
    }

    public List<Series> findAll() {
        return seriesRepository.findAll();
    }

    public Series findById(Long id) {
        return seriesRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Série não encontrada."));
    }

    private void validateSeries(String title, Integer releaseYear) {
        if (title == null || title.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O título da série é obrigatório.");
        }
        if (releaseYear != null && (releaseYear < 1888 || releaseYear > Year.now().getValue() + 5)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ano de lançamento inválido.");
        }
    }

    private void validateFile(MultipartFile file, String message) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private String saveFile(MultipartFile file, String directory) {
        String originalName = Optional.ofNullable(file.getOriginalFilename()).orElse("");
        String extension = getSafeExtension(originalName);
        String storedName = UUID.randomUUID() + extension;
        Path targetDirectory = Path.of(storageLocation, directory).toAbsolutePath().normalize();
        Path target = targetDirectory.resolve(storedName).normalize();

        if (!target.startsWith(targetDirectory)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome de arquivo inválido.");
        }

        try {
            Files.createDirectories(targetDirectory);
            file.transferTo(target);
            return "/media/" + directory + "/" + storedName;
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Não foi possível armazenar o arquivo da série.",
                    exception
            );
        }
    }

    private String episodeTitle(MultipartFile file, int episodeNumber) {
        String filename = Optional.ofNullable(file.getOriginalFilename()).orElse("");
        int dotIndex = filename.lastIndexOf('.');
        String title = (dotIndex > 0 ? filename.substring(0, dotIndex) : filename)
                .replace('_', ' ')
                .trim();
        return title.isBlank() ? "Episódio " + episodeNumber : title;
    }

    private String getSafeExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            return "";
        }

        String extension = filename.substring(dotIndex).toLowerCase();
        return extension.matches("\\.[a-z0-9]{1,10}") ? extension : "";
    }
}

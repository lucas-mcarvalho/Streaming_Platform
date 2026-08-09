package com.user.streaming.service;


import com.user.streaming.models.Category;
import com.user.streaming.models.Movies;
import com.user.streaming.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private CategoryService categoryService;

    @Value("${app.storage.location:./storage}")
    private String storageLocation;

    public Movies save(String title,String description,
                       MultipartFile movie,
                       MultipartFile cover,
                       List<Long> categoryIds
                       ){

        Set<Category> categories = categoryService.findAllByIds(categoryIds);
        String videoPath = saveFile(movie, "videos");
        String coverPath = saveFile(cover, "covers");

        Movies movies = new Movies();

        movies.setTitle(title);
        movies.setDescription(description);
        movies.setDatapath(videoPath);
        movies.setCoverUrl(coverPath);
        movies.setCategories(categories);

        return movieRepository.save(movies);
    }

    public List<Movies> findAll(){
        return movieRepository.findAll();
    }



    private String saveFile(MultipartFile file, String directory) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O arquivo enviado está vazio.");
        }

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
                    "Não foi possível armazenar o arquivo.",
                    exception
            );
        }
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

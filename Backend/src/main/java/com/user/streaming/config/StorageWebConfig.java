package com.user.streaming.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
public class StorageWebConfig implements WebMvcConfigurer {

    @Value("${app.storage.location:./storage}")
    private String storageLocation;

    @PostConstruct
    public void createStorageDirectories() throws IOException {
        Path root = storageRoot();
        Files.createDirectories(root.resolve("videos"));
        Files.createDirectories(root.resolve("covers"));
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String storageUri = storageRoot().toUri().toString();
        registry.addResourceHandler("/media/**")
                .addResourceLocations(storageUri)
                .setCachePeriod(3600);
    }

    private Path storageRoot() {
        return Path.of(storageLocation).toAbsolutePath().normalize();
    }
}

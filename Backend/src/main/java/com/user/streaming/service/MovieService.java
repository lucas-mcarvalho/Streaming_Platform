package com.user.streaming.service;


import com.user.streaming.dto.MovieDTO;
import com.user.streaming.models.Movies;
import com.user.streaming.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public Movies save(String title,
                       MultipartFile movie,
                       MultipartFile cover
                       ){

        String videoPath = saveVideo(movie);
        String coverPath = saveCover(cover);

        Movies movies = new Movies();

        movies.setTitle(title);
        movies.setDatapath(videoPath);
        movies.setCoverUrl(coverPath);

        return movieRepository.save(movies);
    }

    public List<Movies> findAll(){
        return movieRepository.findAll();
    }



    private String saveVideo(MultipartFile file) {
        return "videos/" + file.getOriginalFilename();
    }
    private String saveCover(MultipartFile file) {
        return "covers/" + file.getOriginalFilename();
    }
}


package com.user.streaming.repository;

import com.user.streaming.models.Movies;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movies, Long> {

}

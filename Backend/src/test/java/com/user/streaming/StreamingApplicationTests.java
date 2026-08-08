package com.user.streaming;

import com.user.streaming.dto.SeriesRequestDTO;
import com.user.streaming.models.Category;
import com.user.streaming.models.Episode;
import com.user.streaming.models.Movies;
import com.user.streaming.models.Series;
import com.user.streaming.repository.MovieRepository;
import com.user.streaming.repository.SeriesRepository;
import com.user.streaming.service.CategoryService;
import com.user.streaming.service.SeriesService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class StreamingApplicationTests {

	@Autowired
	private CategoryService categoryService;

	@Autowired
	private SeriesService seriesService;

	@Autowired
	private MovieRepository movieRepository;

	@Autowired
	private SeriesRepository seriesRepository;

	@Test
	void contextLoads() {
	}

	@Test
	@Transactional
	void categoryCanBeRelatedToMoviesAndSeries() {
		Category category = categoryService.create("Ficção científica");

		Movies movie = new Movies();
		movie.setTitle("Filme de teste");
		movie.setDatapath("test/movie.mp4");
		movie.setCoverUrl("/media/test/cover.jpg");
		movie.setCategories(Set.of(category));
		Movies savedMovie = movieRepository.saveAndFlush(movie);

		Series savedSeries = seriesService.create(new SeriesRequestDTO(
				"Série de teste",
				"Descrição de teste",
				"/media/test/series.jpg",
				2026,
				Set.of(category.getId())
		));
		savedSeries.addEpisode(new Episode("Piloto", 1, "/media/series/episodes/piloto.mp4"));
		savedSeries = seriesRepository.saveAndFlush(savedSeries);

		assertThat(savedMovie.getCategories()).extracting(Category::getId).containsExactly(category.getId());
		assertThat(savedSeries.getCategories()).extracting(Category::getId).containsExactly(category.getId());
		assertThat(savedSeries.getEpisodes()).extracting(Episode::getTitle).containsExactly("Piloto");
	}

}

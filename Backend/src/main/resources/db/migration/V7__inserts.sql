-- Categorias
INSERT INTO tb_categories (name)
SELECT category_name
FROM (
    VALUES
        ('Drama'),
        ('Ação'),
        ('Ficção científica'),
        ('Suspense')
) AS categories(category_name)
WHERE NOT EXISTS (
    SELECT 1
    FROM tb_categories
    WHERE name = category_name
);

-- Filme
INSERT INTO tb_movies (title, datapath, cover_url)
SELECT
    'Driver',
    'https://pub-d7d01c081bf34a9cb74cdc3a2ddb85b6.r2.dev/Movies/Driver/hls/index.m3u8',
    'https://pub-d7d01c081bf34a9cb74cdc3a2ddb85b6.r2.dev/Movies/Driver/Drive_Bluray.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM tb_movies WHERE title = 'Driver'
);

-- Relaciona Driver com Drama e Ação
INSERT INTO tb_movie_category (movie_id, category_id)
SELECT movie.id, category.id
FROM (
    SELECT id
    FROM tb_movies
    WHERE title = 'Driver'
    ORDER BY id
    LIMIT 1
) movie
CROSS JOIN tb_categories category
WHERE category.name IN ('Drama', 'Ação')
AND NOT EXISTS (
    SELECT 1
    FROM tb_movie_category relation
    WHERE relation.movie_id = movie.id
      AND relation.category_id = category.id
);

INSERT INTO tb_series (title, description, cover_url, release_year)
SELECT
    'The Walking Dead',
    'Rick Grimes acorda de um coma e descobre um mundo dominado por mortos-vivos.',
    'https://pub-d7d01c081bf34a9cb74cdc3a2ddb85b6.r2.dev/Series/TheWalkingDead/cover.jpg',
    2010
WHERE NOT EXISTS (
    SELECT 1 FROM tb_series WHERE LOWER(title) = LOWER('The Walking Dead')
);

INSERT INTO tb_series_category (series_id, category_id)
SELECT series.id, category.id
FROM (
    SELECT id FROM tb_series
    WHERE LOWER(title) = LOWER('The Walking Dead')
    ORDER BY id
    LIMIT 1
) series
CROSS JOIN tb_categories category
WHERE category.name IN ('Drama', 'Suspense')
AND NOT EXISTS (
    SELECT 1 FROM tb_series_category relation
    WHERE relation.series_id = series.id
      AND relation.category_id = category.id
);

INSERT INTO tb_episodes (title, episode_number, datapath, series_id)
SELECT episode.title, episode.episode_number, episode.datapath, series.id
FROM (
    VALUES
        (
            'Days Gone Bye',
            1,
            'https://pub-d7d01c081bf34a9cb74cdc3a2ddb85b6.r2.dev/Series/TheWalkingDead/Season-01/Episode-01/hls/index.m3u8'
        ),
        (
            'Guts',
            2,
            'https://pub-d7d01c081bf34a9cb74cdc3a2ddb85b6.r2.dev/Series/TheWalkingDead/Season-01/Episode-02/hls/index.m3u8'
        )
) AS episode(title, episode_number, datapath)
CROSS JOIN (
    SELECT id FROM tb_series
    WHERE LOWER(title) = LOWER('The Walking Dead')
    ORDER BY id
    LIMIT 1
) series
WHERE NOT EXISTS (
    SELECT 1 FROM tb_episodes existing
    WHERE existing.series_id = series.id
      AND existing.episode_number = episode.episode_number
);

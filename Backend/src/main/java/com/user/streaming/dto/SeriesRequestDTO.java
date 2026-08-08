package com.user.streaming.dto;

import java.util.Set;

public record SeriesRequestDTO(
        String title,
        String description,
        String coverUrl,
        Integer releaseYear,
        Set<Long> categoryIds
) {
}

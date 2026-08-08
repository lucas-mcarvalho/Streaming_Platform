package com.user.streaming.models;


import jakarta.persistence.*;

import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "tb_movies")
public class Movies {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String datapath;
    private String coverUrl;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "tb_movie_category",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @OrderBy("name ASC")
    private Set<Category> categories = new LinkedHashSet<>();


    public Movies(){

    }

    public Long getId() {
        return id;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDatapath() {
        return datapath;
    }

    public void setDatapath(String datapath) {
        this.datapath = datapath;
    }

    public String getCoverUrl() {
        return coverUrl;
    }

    public void setCoverUrl(String coverUrl) {
        this.coverUrl = coverUrl;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories == null ? new LinkedHashSet<>() : categories;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Movies movies = (Movies) o;
        return Objects.equals(id, movies.id) && Objects.equals(title, movies.title) && Objects.equals(datapath, movies.datapath) && Objects.equals(coverUrl, movies.coverUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, datapath, coverUrl);
    }
}

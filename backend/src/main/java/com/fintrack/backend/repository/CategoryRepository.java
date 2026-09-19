package com.fintrack.backend.repository;

import com.fintrack.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByNameAndType(String name, String type);

    boolean existsByNameAndType(String name, String type);
}

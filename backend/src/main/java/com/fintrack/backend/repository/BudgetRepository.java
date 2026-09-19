package com.fintrack.backend.repository;

import com.fintrack.backend.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserId(Long userId);

    List<Budget> findByCategoryId(Long categoryId);

    List<Budget> findByUserIdAndCategoryId(Long userId, Long categoryId);
}

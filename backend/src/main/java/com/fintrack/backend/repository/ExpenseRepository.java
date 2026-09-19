package com.fintrack.backend.repository;

import com.fintrack.backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserId(Long userId);

    List<Expense> findByCategoryId(Long categoryId);

    List<Expense> findByUserIdAndCategoryId(Long userId, Long categoryId);
}
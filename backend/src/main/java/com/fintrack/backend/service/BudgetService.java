package com.fintrack.backend.service;

import com.fintrack.backend.entity.Budget;
import com.fintrack.backend.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public Optional<Budget> getBudgetById(Long id) {
        return budgetRepository.findById(id);
    }

    public List<Budget> getBudgetsByUserId(Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    public List<Budget> getBudgetsByCategoryId(Long categoryId) {
        return budgetRepository.findByCategoryId(categoryId);
    }

    public List<Budget> getBudgetsByUserAndCategory(
            Long userId,
            Long categoryId) {

        return budgetRepository.findByUserIdAndCategoryId(
                userId,
                categoryId);
    }

    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}

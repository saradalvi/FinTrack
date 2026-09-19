package com.fintrack.backend.service;

import com.fintrack.backend.entity.Expense;
import com.fintrack.backend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public List<Expense> getExpensesByUserId(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    public List<Expense> getExpensesByCategoryId(Long categoryId) {
        return expenseRepository.findByCategoryId(categoryId);
    }

    public List<Expense> getExpensesByUserAndCategory(
            Long userId,
            Long categoryId) {

        return expenseRepository.findByUserIdAndCategoryId(
                userId,
                categoryId);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}
package com.fintrack.backend.controller;

import com.fintrack.backend.entity.Budget;
import com.fintrack.backend.service.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(
            @RequestBody Budget budget) {

        Budget createdBudget = budgetService.createBudget(budget);

        return ResponseEntity.ok(createdBudget);
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getAllBudgets() {

        return ResponseEntity.ok(budgetService.getAllBudgets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Budget> getBudgetById(
            @PathVariable Long id) {

        return budgetService.getBudgetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Budget>> getBudgetsByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                budgetService.getBudgetsByUserId(userId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Budget>> getBudgetsByCategoryId(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                budgetService.getBudgetsByCategoryId(categoryId));
    }

    @GetMapping("/user/{userId}/category/{categoryId}")
    public ResponseEntity<List<Budget>> getBudgetsByUserAndCategory(
            @PathVariable Long userId,
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                budgetService.getBudgetsByUserAndCategory(
                        userId,
                        categoryId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long id) {

        budgetService.deleteBudget(id);

        return ResponseEntity.noContent().build();
    }
}
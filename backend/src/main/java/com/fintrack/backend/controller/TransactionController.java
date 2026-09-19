package com.fintrack.backend.controller;

import com.fintrack.backend.entity.Transaction;
import com.fintrack.backend.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {

        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestBody Transaction transaction) {

        Transaction createdTransaction =
                transactionService.createTransaction(transaction);

        return ResponseEntity.ok(createdTransaction);
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {

        return ResponseEntity.ok(
                transactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(
            @PathVariable Long id) {

        return transactionService
                .getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionsByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                transactionService
                        .getTransactionsByUserId(userId));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Transaction>>
    getTransactionsByCategoryId(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                transactionService
                        .getTransactionsByCategoryId(categoryId));
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<Transaction>>
    getTransactionsByUserAndType(
            @PathVariable Long userId,
            @PathVariable String type) {

        return ResponseEntity.ok(
                transactionService
                        .getTransactionsByUserAndType(
                                userId,
                                type));
    }

    @GetMapping("/user/{userId}/category/{categoryId}")
    public ResponseEntity<List<Transaction>>
    getTransactionsByUserAndCategory(
            @PathVariable Long userId,
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                transactionService
                        .getTransactionsByUserAndCategory(
                                userId,
                                categoryId));
    }

    @GetMapping(
            "/user/{userId}/type/{type}/category/{categoryId}")
    public ResponseEntity<List<Transaction>>
    getTransactionsByUserTypeAndCategory(
            @PathVariable Long userId,
            @PathVariable String type,
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                transactionService
                        .getTransactionsByUserTypeAndCategory(
                                userId,
                                type,
                                categoryId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id) {

        transactionService.deleteTransaction(id);

        return ResponseEntity.noContent().build();
    }
}
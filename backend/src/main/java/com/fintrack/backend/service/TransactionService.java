package com.fintrack.backend.service;

import com.fintrack.backend.entity.Transaction;
import com.fintrack.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(
            TransactionRepository transactionRepository) {

        this.transactionRepository = transactionRepository;
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public List<Transaction> getTransactionsByUserId(Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    public List<Transaction> getTransactionsByCategoryId(Long categoryId) {
        return transactionRepository.findByCategoryId(categoryId);
    }

    public List<Transaction> getTransactionsByUserAndType(
            Long userId,
            String type) {

        return transactionRepository.findByUserIdAndType(
                userId,
                type);
    }

    public List<Transaction> getTransactionsByUserAndCategory(
            Long userId,
            Long categoryId) {

        return transactionRepository.findByUserIdAndCategoryId(
                userId,
                categoryId);
    }

    public List<Transaction> getTransactionsByUserTypeAndCategory(
            Long userId,
            String type,
            Long categoryId) {

        return transactionRepository
                .findByUserIdAndTypeAndCategoryId(
                        userId,
                        type,
                        categoryId);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
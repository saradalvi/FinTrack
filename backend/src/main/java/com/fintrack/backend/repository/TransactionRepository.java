package com.fintrack.backend.repository;

import com.fintrack.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserId(Long userId);

    List<Transaction> findByCategoryId(Long categoryId);

    List<Transaction> findByUserIdAndType(Long userId, String type);

    List<Transaction> findByUserIdAndCategoryId(
            Long userId,
            Long categoryId);

    List<Transaction> findByUserIdAndTypeAndCategoryId(
            Long userId,
            String type,
            Long categoryId);
}
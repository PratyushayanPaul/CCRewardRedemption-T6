package com.tcs.RewardRedemptionApp.repository;

import com.tcs.RewardRedemptionApp.Entity.Transaction;
import com.tcs.RewardRedemptionApp.Entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionProcessRepository extends JpaRepository<Transaction,Long> {

    List<Transaction> findByStatus(String status);
}

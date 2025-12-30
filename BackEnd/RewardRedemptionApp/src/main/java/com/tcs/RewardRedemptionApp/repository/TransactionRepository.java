package com.tcs.RewardRedemptionApp.repository;

import com.tcs.RewardRedemptionApp.Entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transactions,Integer> {

    List<Transactions> findByTransactionStatus(String status);
}

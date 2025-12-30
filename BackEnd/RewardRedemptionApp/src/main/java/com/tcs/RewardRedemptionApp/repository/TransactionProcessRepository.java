package com.tcs.RewardRedemptionApp.repository;

import com.tcs.RewardRedemptionApp.Entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionProcessRepository extends JpaRepository<Transactions,Long> {

    List<Transactions> findByTransactionStatus(String status);
}

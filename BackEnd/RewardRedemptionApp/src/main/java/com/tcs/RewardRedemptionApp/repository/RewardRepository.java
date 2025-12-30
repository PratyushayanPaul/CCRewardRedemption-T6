package com.tcs.RewardRedemptionApp.repository;

import com.tcs.RewardRedemptionApp.Entity.RewardPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RewardRepository extends JpaRepository<RewardPoint, Integer> {
    Optional<RewardPoint> findByCreditCardNumber_CreditCardNumber(String creditCardNumber);
}

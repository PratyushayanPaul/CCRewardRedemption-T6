package com.tcs.RewardRedemptionApp.Repository;

import com.tcs.RewardRedemptionApp.Entity.CreditCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditCardRepository extends JpaRepository<CreditCard, Double> {
}

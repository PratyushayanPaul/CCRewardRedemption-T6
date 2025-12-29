package com.tcs.RewardRedemptionApp.repository;

import com.tcs.RewardRedemptionApp.Entity.CreditCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CreditCardRepository extends JpaRepository<CreditCard, Double> {
    CreditCard findByCreditCardNumber(String creditCardNumber);
    List<CreditCard> findByCustomerCustomerID(Integer customerID);
    //Optional<CreditCard> findByCreditCardId(Long creditCardId);

}

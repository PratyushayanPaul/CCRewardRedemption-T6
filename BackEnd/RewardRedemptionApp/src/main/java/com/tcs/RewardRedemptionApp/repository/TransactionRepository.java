package com.tcs.RewardRedemptionApp.repository;

import com.tcs.RewardRedemptionApp.Entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction,Long> {
    //List<Transaction> findByCreditCardCreditCardId(Long creditCardId);

    List<Transaction> findByCreditCardCreditCardNumber(String creditCardNumber);

    //List<Transaction> findByCreditCard_CreditCardIdIn(List<Long> creditCardIds);

    //List<Transaction> findByCreditCardCustomerCustomerID(Integer customerID);
}
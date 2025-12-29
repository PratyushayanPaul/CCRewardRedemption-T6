package com.tcs.RewardRedemptionApp.Repository;

import com.tcs.RewardRedemptionApp.Entity.CreditCard;
import com.tcs.RewardRedemptionApp.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CreditCardRepository extends JpaRepository<CreditCard, String> {

    CreditCard findByCreditCardNumber(String creditCardNumber);

    List<CreditCard> findByCustomerCustomerID(Integer customerID);

    List<CreditCard> findByCustomer(Customer customer);
}

package com.tcs.RewardRedemptionApp.Repository;

import com.tcs.RewardRedemptionApp.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    List<Customer> getCustomersByCustomerID(Integer customerID);
}

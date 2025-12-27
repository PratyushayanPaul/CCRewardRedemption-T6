package com.tcs.RewardRedemptionApp.Repository;

import com.tcs.RewardRedemptionApp.Entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
}

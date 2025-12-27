package com.tcs.RewardRedemptionApp.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class RewardPoint {

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    CreditCard creditCardNumber;

    private Double points;
}

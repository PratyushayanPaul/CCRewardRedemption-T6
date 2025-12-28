package com.tcs.RewardRedemptionApp.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class CreditCard {

    @Id
    private String creditCardNumber;

    private String creditCardHolderName;
    private Integer creditCardCvv;
    private LocalDate creditCardExpiry;
    private Double rewardPoints;

    @ManyToOne(fetch = FetchType.LAZY)
    Customer customerID;
}

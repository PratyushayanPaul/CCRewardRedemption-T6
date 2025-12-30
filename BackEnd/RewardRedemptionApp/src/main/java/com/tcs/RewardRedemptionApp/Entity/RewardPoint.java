package com.tcs.RewardRedemptionApp.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class RewardPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer serialNo;

    @OneToOne(fetch = FetchType.LAZY)
    CreditCard creditCardNumber;

    private Double points;

}

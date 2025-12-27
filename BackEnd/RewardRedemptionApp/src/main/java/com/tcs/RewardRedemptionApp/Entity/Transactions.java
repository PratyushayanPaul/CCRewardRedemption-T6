package com.tcs.RewardRedemptionApp.Entity;

import jakarta.persistence.*;
import org.hibernate.sql.exec.spi.StandardEntityInstanceResolver;

import java.time.LocalDate;

@Entity
public class Transactions {

    private Integer serialNo;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionID;

    private LocalDate transactionDate;
    private String transactionDetails;
    private Double transactionAmount;
    private String transactionStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    CreditCard creditCardNumber;
}

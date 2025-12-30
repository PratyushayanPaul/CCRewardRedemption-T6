package com.tcs.RewardRedemptionApp.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    private double amount;

    //Ensures reward processed only once
    private String status;

    @Column(name = "transaction_date",nullable = false)
    private LocalDateTime transactionDate;
    private String transactionDetails;

    @ManyToOne
    @JoinColumn(name="credit_card_number", referencedColumnName = "creditCardNumber", nullable = false)
    private CreditCard creditCard;
}

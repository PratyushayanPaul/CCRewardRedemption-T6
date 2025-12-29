package com.tcs.RewardRedemptionApp.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TransactionDTO {

    private String transactionId;
    private String date;
    private String creditCardNumber;
    private double amount;
    private String status;
}
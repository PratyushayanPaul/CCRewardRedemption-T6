package com.tcs.RewardRedemptionApp.Dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreditCardDTO {

    private String creditCardNumber;

    private String creditCardHolderName;
    private Integer creditCardCvv;
    private LocalDate creditCardExpiry;
}

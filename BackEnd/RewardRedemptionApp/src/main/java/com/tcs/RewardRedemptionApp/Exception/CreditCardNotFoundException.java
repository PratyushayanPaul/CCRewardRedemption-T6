package com.tcs.RewardRedemptionApp.Exception;

public class CreditCardNotFoundException extends RuntimeException
{
    public CreditCardNotFoundException(String creditCardNumber) {
        super("Credit card not found with id: " +creditCardNumber);
    }
}

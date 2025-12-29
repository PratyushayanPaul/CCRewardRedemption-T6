package com.tcs.RewardRedemptionApp.Exception;

public class CreditCardForCustomerNotFoundException extends RuntimeException
{
    public CreditCardForCustomerNotFoundException(Integer customerId) {
        super("Customer has no credit cards: " +customerId);
    }
}

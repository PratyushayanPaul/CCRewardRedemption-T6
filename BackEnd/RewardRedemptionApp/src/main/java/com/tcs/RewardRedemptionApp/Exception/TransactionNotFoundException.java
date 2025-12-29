package com.tcs.RewardRedemptionApp.Exception;

public class TransactionNotFoundException extends RuntimeException
{
    public TransactionNotFoundException(Long transactionId){
        super("Transaction not found with id : " + transactionId);
    }
}

package com.tcs.RewardRedemptionApp.Service;

import com.tcs.RewardRedemptionApp.Dto.TransactionDTO;
import com.tcs.RewardRedemptionApp.Entity.Transaction;
import java.util.List;

public interface TransactionService {
    List<TransactionDTO> generateTransactionsByCardNumber(String creditCardNumber);

    //List<Transaction> generateTransactionsForCustomer(Integer customerID);

    List<TransactionDTO> getTransactionsByCardNumber(String creditCardNumber);

    //List<TransactionDTO> getTransactionsByCustomer(Integer customerID);

    TransactionDTO getTransactionById(Long transactionId);
}
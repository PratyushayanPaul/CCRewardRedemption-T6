package com.tcs.RewardRedemptionApp.Controller;

import com.tcs.RewardRedemptionApp.Dto.TransactionDTO;
import com.tcs.RewardRedemptionApp.Entity.Transaction;
import com.tcs.RewardRedemptionApp.Service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {
    private final TransactionService transactionService;

    //Generate 50 transaction for a card
    @PostMapping("/generate/{creditCardNumber}")
    public List<TransactionDTO> generateTransactions(@PathVariable String creditCardNumber) {
        return transactionService.generateTransactionsByCardNumber(creditCardNumber);
    }


    //Generate 50 transaction total for Customer
//    @PostMapping("/generate/customer/{customerID}")
//    public List<Transaction> generateForCustomer(@PathVariable("customerID") Integer customerID){
//        return transactionService.generateTransactionsForCustomer(customerID);
//    }

    //Get transactions for ONE card
    @GetMapping("/card/{creditCardNumber}")
    public List<TransactionDTO> getTransactionsByCard(@PathVariable("creditCardNumber") String creditCardNumber){
        return transactionService.getTransactionsByCardNumber(creditCardNumber);
    }

    //Get transactions for ALL cards of a customer
//    @GetMapping("/customer/{id}")
//    public List<TransactionDTO> getByCustomer(@PathVariable("id") Integer customerID){
//        return transactionService.getTransactionsByCustomer(customerID);
//    }

    //Get transaction by transactionId
    @GetMapping("/{transactionId}")
    public TransactionDTO getTransaction(@PathVariable("transactionId") Long transactionId){
        return transactionService.getTransactionById(transactionId);
    }
}
package com.tcs.RewardRedemptionApp.Controller;

import com.tcs.RewardRedemptionApp.Entity.Transactions;
import com.tcs.RewardRedemptionApp.Service.TransactionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/CCReward")
public class RewardProcessingController {
    TransactionServiceImpl transactionService;

    @Autowired
    public RewardProcessingController(TransactionServiceImpl transactionService){
        this.transactionService=transactionService;
    }
    @PutMapping("/processRewards")
    public void processTransactions(){
        boolean done=transactionService.processTransactions();
    }
}

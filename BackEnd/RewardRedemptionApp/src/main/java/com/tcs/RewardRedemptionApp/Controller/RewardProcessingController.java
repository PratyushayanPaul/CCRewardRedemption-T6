package com.tcs.RewardRedemptionApp.Controller;

import com.tcs.RewardRedemptionApp.Entity.Transaction;
import com.tcs.RewardRedemptionApp.Service.TransactionProcessService;
import com.tcs.RewardRedemptionApp.Service.TransactionProcessServiceImpl;
import com.tcs.RewardRedemptionApp.Service.TransactionServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/CCReward")
public class RewardProcessingController {
    TransactionProcessServiceImpl transactionService;

    @Autowired
    public RewardProcessingController(TransactionProcessServiceImpl transactionService){
        this.transactionService=transactionService;
    }
    @PutMapping("/processRewards")
    public void processTransactions(){
        boolean done=transactionService.processTransactions();
    }
}

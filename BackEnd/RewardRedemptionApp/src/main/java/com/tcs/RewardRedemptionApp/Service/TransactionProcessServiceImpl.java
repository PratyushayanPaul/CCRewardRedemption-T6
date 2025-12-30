package com.tcs.RewardRedemptionApp.Service;

import com.tcs.RewardRedemptionApp.Entity.Customer;
import com.tcs.RewardRedemptionApp.Entity.RewardPoint;
import com.tcs.RewardRedemptionApp.Entity.Transactions;
import com.tcs.RewardRedemptionApp.Enum.CustomerType;
import com.tcs.RewardRedemptionApp.exception.CCRewardRedemption;
import com.tcs.RewardRedemptionApp.repository.RewardRepository;
import com.tcs.RewardRedemptionApp.repository.TransactionProcessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tcs.RewardRedemptionApp.Repository.CreditCardRepository;

import java.util.List;

@Service
public class TransactionProcessServiceImpl implements TransactionProcessService {
    private final TransactionProcessRepository transactionRepository;
    private final CreditCardRepository creditCardRepository;
    private final RewardRepository rewardRepository;

    @Autowired
    public TransactionProcessServiceImpl(TransactionProcessRepository transactionRepository, CreditCardRepository creditCardRepository, RewardRepository rewardRepository){
        this.transactionRepository=transactionRepository;
        this.creditCardRepository = creditCardRepository;
        this.rewardRepository=rewardRepository;
    }

    public boolean processTransactions(){
        Transactions transactions=new Transactions();
            List<Transactions> transaction = transactionRepository.findByTransactionStatus("Unprocessed");
            if (transaction.isEmpty()) {
                throw new CCRewardRedemption("Everything is processed");
            } else {
                for (Transactions transactions1 : transaction) {
                    transactions1.setTransactionStatus("Processed");
                    System.out.println(transactions1.getCreditCardNumber());
                }
                transactionRepository.saveAll(transaction);
            }
            RewardPoint rewardPoint=new RewardPoint();
            Customer customer=new Customer();
            for(Transactions transactions1 : transaction){
                Customer customer1 =transactions1.getCreditCardNumber().getCustomerID();
                if(customer1.getCustomerType().equals("Regular"))
                    rewardPoint.setPoints(CustomerType.REGULAR.calculateRewardPoints(transactions1.getTransactionAmount()));
                else if(customer1.getCustomerType().equals("Premium"))
                    rewardPoint.setPoints(CustomerType.PREMIUM.calculateRewardPoints(transactions1.getTransactionAmount()));
                rewardPoint.setCreditCardNumber(transactions1.getCreditCardNumber());
                rewardRepository.save(rewardPoint);
            }
        return true;
        }
}


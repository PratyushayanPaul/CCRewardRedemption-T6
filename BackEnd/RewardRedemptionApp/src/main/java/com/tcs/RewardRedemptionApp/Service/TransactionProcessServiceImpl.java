package com.tcs.RewardRedemptionApp.Service;

import com.tcs.RewardRedemptionApp.Entity.Customer;
import com.tcs.RewardRedemptionApp.Entity.RewardPoint;
import com.tcs.RewardRedemptionApp.Entity.Transaction;
import com.tcs.RewardRedemptionApp.Entity.Transaction;
import com.tcs.RewardRedemptionApp.Enum.CustomerTypeReward;
import com.tcs.RewardRedemptionApp.Exception.CCRewardRedemption;
import com.tcs.RewardRedemptionApp.repository.RewardRepository;
import com.tcs.RewardRedemptionApp.repository.TransactionProcessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tcs.RewardRedemptionApp.repository.CreditCardRepository;

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
        Transaction transactions=new Transaction();
            List<Transaction> transaction = transactionRepository.findByStatus("Unprocessed");
            if (transaction.isEmpty()) {
                throw new CCRewardRedemption("Everything is processed");
            } else {
                for (Transaction transactions1 : transaction) {
                    transactions1.setStatus("Processed");
                    System.out.println(transactions1.getCreditCard());
                }
                transactionRepository.saveAll(transaction);
            }
            RewardPoint rewardPoint=new RewardPoint();
            Customer customer=new Customer();
            for(Transaction transactions1 : transaction){
                System.out.println(transactions1);
                Customer customer1 =transactions1.getCreditCard().getCustomer();
                if(customer1.getCustomerType().equals("REGULAR"))
                    rewardPoint.setPoints(CustomerTypeReward.REGULAR.calculateRewardPoints(transactions1.getAmount()));
                else if(customer1.getCustomerType().equals("PREMIUM"))
                    rewardPoint.setPoints(CustomerTypeReward.PREMIUM.calculateRewardPoints(transactions1.getAmount()));
                rewardPoint.setCreditCardNumber(transactions1.getCreditCard());
                rewardRepository.save(rewardPoint);
            }
        return true;
        }
}


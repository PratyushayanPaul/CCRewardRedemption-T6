package com.tcs.RewardRedemptionApp.Service;

import com.tcs.RewardRedemptionApp.Dto.TransactionDTO;
import com.tcs.RewardRedemptionApp.Entity.CreditCard;
import com.tcs.RewardRedemptionApp.Entity.Transaction;
import com.tcs.RewardRedemptionApp.Exception.CreditCardForCustomerNotFoundException;
import com.tcs.RewardRedemptionApp.Exception.CreditCardNotFoundException;
import com.tcs.RewardRedemptionApp.Exception.TransactionNotFoundException;
import com.tcs.RewardRedemptionApp.repository.CreditCardRepository;
import com.tcs.RewardRedemptionApp.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CreditCardRepository creditCardRepository;

    //Generate exactly 50 Transactions for one card
    @Override
    public List<TransactionDTO> generateTransactionsByCardNumber(String creditCardNumber) {

        CreditCard card = creditCardRepository.findByCreditCardNumber(creditCardNumber);
        if (card == null) {
            throw new CreditCardNotFoundException(creditCardNumber);
        }

        Random random = new Random();

        for (int i = 0; i < 50; i++) {
            Transaction transaction = new Transaction();
            transaction.setAmount(500 + random.nextInt(49501));
            transaction.setStatus("Unprocessed");
            transaction.setTransactionDate(LocalDateTime.now());
            transaction.setCreditCard(card);
            transactionRepository.save(transaction);
        }

        return getTransactionsByCardNumber(creditCardNumber);
    }

//
//    //Generate exactly 50 Transactions total across all cards
//    @Override
//    public List<Transaction> generateTransactionsForCustomer(Integer customerID) {
//        CreditCard creditCardNumber = new CreditCard();
//        List<CreditCard> cardIds = creditCardRepository.findByCustomerCustomerID(customerID);
//
//        if(cardIds.isEmpty()){
//            throw  new CreditCardForCustomerNotFoundException((customerID));
//        }
//        Random random = new Random();
//
//        for (int i = 0; i < 50; i++) {
//            CreditCard creditCard= cardIds.get(random.nextInt(cardIds.size()));
//            Transaction transaction = new Transaction();
//            transaction.setAmount(500 + random.nextInt(49501));
//            transaction.setStatus(transaction.getStatus());
//            transaction.setTransactionDate(LocalDateTime.now());
//            transaction.setCreditCard(creditCardNumber);
//            transactionRepository.save(transaction);
//        }
//        return transactionRepository.findByCreditCard_CreditCardIdIn(cardIds.stream().map(CreditCard::getCreditCardId).toList());
//
//    }

    //Fetch transactions for one card
    @Override
    public List<TransactionDTO> getTransactionsByCardNumber(String creditCardNumber) {
        return transactionRepository.findByCreditCardCreditCardNumber(creditCardNumber)
                .stream()
                .map(this::mapToResponse).toList();
    }

//    //Fetch transactions across all cards of customer
//    @Override
//    public List<TransactionDTO> getTransactionsByCustomer(Integer customerID) {
//        List<Long> cardIds = creditCardRepository.findByCustomerCustomerID(customerID)
//                .stream()
//                .map(CreditCard::getCreditCardId)
//                .toList();
//        if (cardIds.isEmpty()) {
//            return List.of();
//        }
//        return transactionRepository.findByCreditCard_CreditCardIdIn(cardIds)
//                .stream()
//                .map(this::mapToResponse)
//                .toList();
//    }


    //Fetch transactions by transactionId
    @Override
    public TransactionDTO getTransactionById(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new TransactionNotFoundException(transactionId));

        return mapToResponse(transaction);
    }

    private TransactionDTO mapToResponse(Transaction transaction) {
        return new TransactionDTO(
                "TXN" + transaction.getTransactionId(),
                transaction.getTransactionDate().toString(),
                maskCard(transaction.getCreditCard().getCreditCardNumber()),
                transaction.getAmount(),
                transaction.getStatus()
        );
    }

    private String maskCard(String cardNumber) {
        return cardNumber.substring(0,4)+"-XXXX-XXXX-"+cardNumber.substring(cardNumber.length()-4);
    }
}

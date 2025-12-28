package com.tcs.RewardRedemptionApp.Service;

import com.tcs.RewardRedemptionApp.Dto.CreditCardDTO;
import com.tcs.RewardRedemptionApp.Entity.CreditCard;
import com.tcs.RewardRedemptionApp.Entity.Customer;
import com.tcs.RewardRedemptionApp.Repository.CreditCardRepository;
import com.tcs.RewardRedemptionApp.Repository.CustomerRepository;
import org.springframework.stereotype.Service;

@Service
public class CreditCardServiceImpl {

    private final CreditCardRepository creditCardRepository;
    private final CustomerRepository customerRepository;

    public CreditCardServiceImpl(CreditCardRepository creditCardRepository, CustomerRepository customerRepository) {
        this.creditCardRepository = creditCardRepository;
        this.customerRepository = customerRepository;
    }


    public void addCard(Integer customerID, CreditCardDTO creditCardDTO) {
        if (customerRepository.findById(customerID).isPresent()) {
            Customer customer = customerRepository.findById(customerID).get();
            CreditCard creditCard = new CreditCard();
            creditCard.setCustomerID(customer);
            creditCard.setCreditCardNumber(creditCardDTO.getCreditCardNumber());
            creditCard.setCreditCardHolderName(creditCardDTO.getCreditCardHolderName());
            creditCard.setCreditCardExpiry(creditCardDTO.getCreditCardExpiry());
            creditCard.setCreditCardCvv(creditCardDTO.getCreditCardCvv());
            creditCard.setRewardPoints(0.0);

            CreditCard creditCardSaved = creditCardRepository.save(creditCard);
        }
        else{
            System.out.println("Customer not found");
        }
    }

    public CreditCard findCustomerByCC(String creditCardNumber) {
        CreditCard creditCard = creditCardRepository.findByCreditCardNumber(creditCardNumber);
        if(creditCard!=null){
            System.out.println(creditCardNumber);
            return creditCard;
        }
        else{
            System.out.println("Customer not found");
            return null;
        }
    }
}

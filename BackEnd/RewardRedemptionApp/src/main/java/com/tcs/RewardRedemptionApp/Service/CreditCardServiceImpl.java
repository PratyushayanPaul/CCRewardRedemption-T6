package com.tcs.RewardRedemptionApp.Service;

import com.tcs.RewardRedemptionApp.Dto.CreditCardDTO;
import com.tcs.RewardRedemptionApp.Entity.CreditCard;
import com.tcs.RewardRedemptionApp.Entity.Customer;

import com.tcs.RewardRedemptionApp.Repository.CustomerRepository;
import com.tcs.RewardRedemptionApp.Repository.CreditCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
            creditCard.setCustomer(customer);
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
    public List<CreditCardDTO> getCustomerCreditCards(Integer customerID) {

        Customer customer = customerRepository.findByCustomerID(customerID);
        if (customer == null) {
            throw new RuntimeException(
                    "Customer not found with ID: " + customerID);
        }

        List<CreditCard> cards =
                creditCardRepository.findByCustomer(customer);

        List<CreditCardDTO> dtoList = new ArrayList<>();

        for (CreditCard card : cards) {
            CreditCardDTO dto = new CreditCardDTO();
            dto.setCreditCardNumber(card.getCreditCardNumber());
            dto.setCreditCardHolderName(card.getCreditCardHolderName());
            dto.setCreditCardExpiry(card.getCreditCardExpiry());
            dto.setCreditCardCvv(card.getCreditCardCvv());
            dtoList.add(dto);
        }
        return dtoList;
    }
}


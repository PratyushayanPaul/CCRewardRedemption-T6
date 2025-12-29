package com.tcs.RewardRedemptionApp.Service;

import com.tcs.RewardRedemptionApp.Dto.CreditCardDTO;

import java.util.List;

public interface CreditCardService {
    List<CreditCardDTO> getCustomerCreditCards(Integer customerID);
}

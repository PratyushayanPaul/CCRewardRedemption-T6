package com.tcs.RewardRedemptionApp.Controller;


import com.tcs.RewardRedemptionApp.Dto.CreditCardDTO;
import com.tcs.RewardRedemptionApp.Service.CreditCardService;
import com.tcs.RewardRedemptionApp.Service.CreditCardServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/CCReward")
public class CreditCardController {

    private final CreditCardServiceImpl creditCardService;

    public CreditCardController(CreditCardServiceImpl creditCardService) {
        this.creditCardService = creditCardService;
    }

    @PutMapping("addCC/{customerID}")
    public ResponseEntity<String> addCC(@PathVariable Integer customerID, @RequestBody CreditCardDTO creditCardDTO){
        creditCardService.addCard(customerID, creditCardDTO);
        String message = creditCardDTO.getCreditCardNumber() + " has been added successfully";
        return ResponseEntity.status(200).body(message);
    }
}

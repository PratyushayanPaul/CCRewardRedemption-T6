package com.tcs.RewardRedemptionApp.Controller;

import com.tcs.RewardRedemptionApp.Dto.CustomerDTO;
import com.tcs.RewardRedemptionApp.Service.CustomerServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/userRegister")
public class Controller {

    private final CustomerServiceImpl customerService;

    public Controller(CustomerServiceImpl customerService) {
        this.customerService = customerService;
    }

    @PostMapping("")
    public ResponseEntity<Integer> customerRegister(@RequestBody CustomerDTO customerDTO){

        Integer customerID = customerService.custReg(customerDTO);
        //String successMessage = customerService.getBookingSuccessMessage(bookingID);
        return ResponseEntity.status(201).body(customerID);
    }
}

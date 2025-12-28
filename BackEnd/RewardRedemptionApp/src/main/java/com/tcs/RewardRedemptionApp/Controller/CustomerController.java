package com.tcs.RewardRedemptionApp.Controller;

import com.tcs.RewardRedemptionApp.Dto.CreditCardDTO;
import com.tcs.RewardRedemptionApp.Dto.CustomerDTO;
import com.tcs.RewardRedemptionApp.Entity.Customer;
import com.tcs.RewardRedemptionApp.Service.CreditCardServiceImpl;
import com.tcs.RewardRedemptionApp.Service.CustomerServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/CCReward")
public class CustomerController {

    private final CustomerServiceImpl customerService;

    public CustomerController(CustomerServiceImpl customerService) {
        this.customerService = customerService;
    }

    @PostMapping("")
    public ResponseEntity<Integer> customerRegister(@RequestBody CustomerDTO customerDTO){

        Integer customerID = customerService.custReg(customerDTO);
        return ResponseEntity.status(201).body(customerID);
    }

    @PutMapping("/delete/{customerID}")
    public ResponseEntity<String> customerDelete(@PathVariable Integer customerID){
        customerService.deleteCust(customerID);
        String message = customerID + " has been deleted successfully";
        return ResponseEntity.status(200).body(message);
    }

    @GetMapping("/allcustomer")
    public ResponseEntity<List<Customer>> getAllCustomer(){
        List <Customer> customerList = customerService.getAllCust();
        return ResponseEntity.status(200).body(customerList);
    }
}

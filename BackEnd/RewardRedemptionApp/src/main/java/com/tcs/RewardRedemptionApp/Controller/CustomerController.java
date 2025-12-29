package com.tcs.RewardRedemptionApp.Controller;

import com.tcs.RewardRedemptionApp.Dto.CreditCardDTO;
import com.tcs.RewardRedemptionApp.Dto.CustomerDTO;
import com.tcs.RewardRedemptionApp.Entity.CreditCard;
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
    private final CreditCardServiceImpl creditCardService;

    public CustomerController(CustomerServiceImpl customerService, CreditCardServiceImpl creditCardService) {
        this.customerService = customerService;
        this.creditCardService = creditCardService;
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

//    @GetMapping("/{creditCardNumber}")
//    public ResponseEntity<Customer> getCustomerByNameOrCCNumber(@PathVariable String creditCardNumber){
//        if(creditCardNumber != null){
//            CreditCard creditCarddeatils = creditCardService.findCustomerByCC(creditCardNumber);
//            Customer customer = customerService.getCutomer(creditCarddeatils.getCustomerID());
//            return ResponseEntity.status(200).body(customer);
//
//        }
//        else{
//            System.out.println("Invalid Input");
//            return ResponseEntity.badRequest().body(null);
//        }
//    }
//
//    @GetMapping("/{customerFirstName}/{customerLastName}")
//    public ResponseEntity<Customer> getCustomerByName(@PathVariable String customerFirstName, @PathVariable String customerLastName){
//        if(!customerFirstName.equals("null") && !customerLastName.equals("null")){
//            Customer customerdetails = customerService.findCustomerByName(customerFirstName,customerLastName);
//            return ResponseEntity.status(200).body(customerdetails);
//        }
//        else{
//            System.out.println("Invalid Input");
//            return ResponseEntity.badRequest().body(null);
//        }
//    }

    @GetMapping("/customer")
    public ResponseEntity<Customer> getCustomer(
            @RequestParam(required = false) String creditCardNumber,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName) {

        if (creditCardNumber != null) {
            CreditCard card = creditCardService.findCustomerByCC(creditCardNumber);
            Customer customer = card.getCustomer();
            return ResponseEntity.ok(customer);
        }

        if (firstName != null && lastName != null) {
            return ResponseEntity.ok(
                    customerService.findCustomerByName(firstName, lastName));
        }

        return ResponseEntity.badRequest().build();
    }


}

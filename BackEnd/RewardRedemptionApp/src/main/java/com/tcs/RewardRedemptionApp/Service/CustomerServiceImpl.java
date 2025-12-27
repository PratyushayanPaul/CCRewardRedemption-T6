package com.tcs.RewardRedemptionApp.Service;

import com.tcs.RewardRedemptionApp.Dto.CustomerDTO;
import com.tcs.RewardRedemptionApp.Entity.Customer;
import com.tcs.RewardRedemptionApp.Enum.CustomerType;
import com.tcs.RewardRedemptionApp.Repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;


@Service
public class CustomerServiceImpl {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Integer custReg(CustomerDTO customerDTO) {

        Customer customer = new Customer();
        customer.setCustomerFirstName(customerDTO.getCustomerFirstName());
        customer.setCustomerLastName(customerDTO.getCustomerLastName());
        customer.setCustomerEmail(customerDTO.getCustomerEmail());
        customer.setCustomerPhone(customerDTO.getCustomerPhone());
        customer.setCustomerDOB(customerDTO.getCustomerDOB());
        customer.setCustomerDOJ(customerDTO.getCustomerDOJ());

        LocalDate threeYearsAgo = LocalDate.now().minusYears(3);

        if (customerDTO.getCustomerDOJ().isBefore(threeYearsAgo)
                || customerDTO.getCustomerDOJ().isEqual(threeYearsAgo)) {
            customer.setCustomerType(String.valueOf(CustomerType.PREMIUM));
        }else{
            customer.setCustomerType(String.valueOf(CustomerType.REGULAR));
        }
        customer.setCustomerStatus("ACTIVE");
        Customer customer1 = customerRepository.save(customer);
        return customer1.getCustomerID();
    }
}
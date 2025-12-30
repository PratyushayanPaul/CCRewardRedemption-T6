package com.tcs.RewardRedemptionApp.Service;

import com.tcs.RewardRedemptionApp.Dto.CustomerDTO;
import com.tcs.RewardRedemptionApp.Entity.Customer;
import com.tcs.RewardRedemptionApp.Enum.CustomerType;
import com.tcs.RewardRedemptionApp.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


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

    public void deleteCust(Integer customerID) {
        if(!customerRepository.existsById(customerID)){
            //throw new CustomerDoesNotExist("Customer does not exist");
            System.out.println("Customer does not exist");
        }
        else {
            Customer customer = customerRepository.findById(customerID).get();
            customer.setCustomerStatus("INACTIVE");
            customerRepository.save(customer);
        }
    }

    public List<Customer> getAllCust() {
        if(customerRepository.findAll().isEmpty()) {
            System.out.println("No customer found");
            return null;
        }
        else{
            return customerRepository.findAll();
        }
    }

    public Customer getCustomer(Customer customerID) {
        if(customerRepository.existsById(customerID.getCustomerID())){
            Customer customer = customerRepository.findById(customerID.getCustomerID()).get();
            Customer customer1 = new Customer();
            customer1.setCustomerID(customer.getCustomerID());
            customer1.setCustomerFirstName(customer.getCustomerFirstName());
            customer1.setCustomerLastName(customer.getCustomerLastName());
            customer1.setCustomerEmail(customer.getCustomerEmail());
            customer1.setCustomerPhone(customer.getCustomerPhone());
            customer1.setCustomerDOB(customer.getCustomerDOB());
            customer1.setCustomerDOJ(customer.getCustomerDOJ());
            customer1.setCustomerStatus(customer.getCustomerStatus());
            customer1.setCustomerType(customer.getCustomerType());
            return customer1;
        }
        else{
            System.out.println("Customer does not exist");
            return null;
        }
    }

        public Customer findCustomerByName(String firstName, String lastName) {
            Customer customer = customerRepository.findByCustomerFirstNameAndCustomerLastName(firstName, lastName);
            if(customer!=null){
                return customer;
            }
            else {
                System.out.println("Customer does not exist");
                return null;
            }
        }

}
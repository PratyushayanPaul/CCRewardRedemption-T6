package com.tcs.RewardRedemptionApp.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDate;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerID;

    private String customerFirstName;
    private String customerLastName;
    private String customerEmail;
    private Double customerPhone;
    private LocalDate customerDOB;
    private String customerStatus;
    private LocalDate customerDOJ;
    private String customerType;
}

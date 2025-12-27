package com.tcs.RewardRedemptionApp.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer customerID;

    private String customerFirstName;
    private String customerLastName;

    @Column(unique = true)
    private String customerEmail;

    @Column(unique = true)
    private Long customerPhone;

    private LocalDate customerDOB;
    private String customerStatus;
    private LocalDate customerDOJ;
    private String customerType;
}

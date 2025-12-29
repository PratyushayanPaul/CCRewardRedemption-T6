package com.tcs.RewardRedemptionApp.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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

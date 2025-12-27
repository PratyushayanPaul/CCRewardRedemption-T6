package com.tcs.RewardRedemptionApp.Entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Ces {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cesId;

    private String cesName;

    private String cesUserName;

    private String cesPassword;

    private String cesRole;
}

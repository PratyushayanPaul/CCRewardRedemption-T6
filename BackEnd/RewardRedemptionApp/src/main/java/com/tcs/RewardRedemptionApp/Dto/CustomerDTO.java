package com.tcs.RewardRedemptionApp.Dto;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.LocalDate;

@Data

public class CustomerDTO {

    private String customerFirstName;
    private String customerLastName;
    private String customerEmail;
    private Long customerPhone;
    private LocalDate customerDOB;
    private LocalDate customerDOJ;
}

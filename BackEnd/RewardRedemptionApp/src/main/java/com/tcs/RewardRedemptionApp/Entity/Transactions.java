package com.tcs.RewardRedemptionApp.Entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.sql.exec.spi.StandardEntityInstanceResolver;

import java.time.LocalDate;

@Entity
@Data
public class Transactions {

    @Column(name = "serial_no", insertable = false, updatable = false)
    private Integer serialNo;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer transactionID;

    private LocalDate transactionDate;
    private String transactionDetails;
    private Double transactionAmount;
    private String transactionStatus;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credit_card_number_credit_card_number", referencedColumnName = "creditCardNumber", nullable = false)
    private CreditCard creditCardNumber;
}

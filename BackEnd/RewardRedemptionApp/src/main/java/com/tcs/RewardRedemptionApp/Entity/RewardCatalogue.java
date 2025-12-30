package com.tcs.RewardRedemptionApp.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class RewardCatalogue {
    @Id
    private String rewardItemsName;

    private String rewardCatalogue;
    private double rewardItemsValue;
    private double rewardItemsPoints;
}

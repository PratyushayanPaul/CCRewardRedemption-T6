package com.tcs.RewardRedemptionApp.Enum;

public enum CustomerType {
    REGULAR(0.05),   // 5% reward points
    PREMIUM(0.10);   // 10% reward points

    private final double rewardRate;

    // Constructor to set the reward rate
    CustomerType(double rewardRate) {
        this.rewardRate = rewardRate;
    }

    // Getter method
    public double getRewardRate() {
        return rewardRate;
    }

    // Method to calculate reward points based on purchase amount
    public double calculateRewardPoints(double purchaseAmount) {
        return purchaseAmount * rewardRate;
    }
}

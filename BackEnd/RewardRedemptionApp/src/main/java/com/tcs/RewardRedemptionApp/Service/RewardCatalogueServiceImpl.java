package com.tcs.RewardRedemptionApp.Service;

import com.tcs.RewardRedemptionApp.Entity.CreditCard;
import com.tcs.RewardRedemptionApp.Entity.RewardCatalogue;
import com.tcs.RewardRedemptionApp.Entity.RewardPoint;
import com.tcs.RewardRedemptionApp.Entity.Transaction;
import com.tcs.RewardRedemptionApp.Exception.CCRewardRedemption;
import com.tcs.RewardRedemptionApp.repository.RewardCatalogueRepository;
import com.tcs.RewardRedemptionApp.repository.RewardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigurationPackage;
import org.springframework.stereotype.Service;
import com.tcs.RewardRedemptionApp.repository.CreditCardRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RewardCatalogueServiceImpl implements RewardCatalogueService{
    private final RewardCatalogueRepository rewardCatalogueRepository;
    private final RewardRepository rewardRepository;
    private final CreditCardRepository creditCardRepository;

    @Autowired
    public RewardCatalogueServiceImpl(CreditCardRepository creditCardRepository,RewardCatalogueRepository rewardCatalogueRepository,RewardRepository rewardRepository){
        this.rewardCatalogueRepository=rewardCatalogueRepository;
        this.rewardRepository=rewardRepository;
        this.creditCardRepository=creditCardRepository;
    }

    public List<RewardCatalogue> getRewardCatalogue(){
        return rewardCatalogueRepository.findAll();
    }

    public void addToCart(List<RewardCatalogue> rewardCatalogue, String creditCardNumber) {
        //System.out.println("inside");

        // Calculate the total reward points from the cart
        double cartRewardPoints = 0.00;
        for (RewardCatalogue rc : rewardCatalogue) {
            cartRewardPoints += rc.getRewardItemsPoints();
        }
        Optional<RewardPoint> rewardPointList = rewardRepository.findByCreditCardNumber_CreditCardNumber(creditCardNumber);
        if (rewardPointList.isPresent()) {
            RewardPoint existingRewardPoint = rewardPointList.get();
//            System.out.println(existingRewardPoint.getPoints());
//            System.out.println(cartRewardPoints);
            if(existingRewardPoint.getPoints()>=cartRewardPoints){
                //System.out.println("in");
            double updatedPoints = existingRewardPoint.getPoints() - cartRewardPoints;
            existingRewardPoint.setPoints(updatedPoints);
            rewardRepository.save(existingRewardPoint);
            }
            else{
                throw new CCRewardRedemption("There is not enough reward points to be redeemed");
            }
        }
    }
}

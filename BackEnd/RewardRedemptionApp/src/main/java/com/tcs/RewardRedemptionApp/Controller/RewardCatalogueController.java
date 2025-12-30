package com.tcs.RewardRedemptionApp.Controller;


import com.tcs.RewardRedemptionApp.Entity.CreditCard;
import com.tcs.RewardRedemptionApp.Entity.RewardCatalogue;
import com.tcs.RewardRedemptionApp.Service.RewardCatalogueServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/CCReward")
public class RewardCatalogueController {
    private final RewardCatalogueServiceImpl rewardCatalogueService;

    @Autowired
    public RewardCatalogueController(RewardCatalogueServiceImpl rewardCatalogueService){
        this.rewardCatalogueService=rewardCatalogueService;
    }
    @GetMapping("/")
    public ResponseEntity<List<RewardCatalogue>> getRewardCatalogue(){
       return new ResponseEntity<>(rewardCatalogueService.getRewardCatalogue(), HttpStatus.OK);
    }
    @PostMapping("/addtoCart/{creditCardNumber}")
    public ResponseEntity<String> addToCart(@RequestBody List<RewardCatalogue> rewardCatalogue, @PathVariable String creditCardNumber){
        //System.out.println(rewardCatalogue);
        System.out.println(creditCardNumber);
        rewardCatalogueService.addToCart(rewardCatalogue,creditCardNumber);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

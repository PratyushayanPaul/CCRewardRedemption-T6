import { Component, computed, signal } from '@angular/core';
import { DataService, RewardItem } from '../data-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
})
export class RewardsComponent {
 

  constructor(private  dataService : DataService, private router : Router ){

  }

  selectedCategory = signal('All');
  
  // Direct signals
  catalog = this.dataService.getRewards();
  allCustomers = this.dataService.getAllCustomers();
  
  categories = computed(() => [...new Set(this.catalog().map((i: { category: any; }) => i.category))]);

  activeCustomer = computed(() => {
    const id = this.dataService.activeCustomerId();
    if (!id) return null;
    return this.allCustomers().find((c: { id: any; }) => c.id === id) || null;
  });

  availablePoints = computed(() => {
    const c = this.activeCustomer();
    return c ? this.dataService.calculatePoints(c) : 0;
  });

  cartItems = computed(() => this.activeCustomer()?.cart || []);
  cartCount = computed(() => this.cartItems().reduce((acc: any, i: { quantity: any; }) => acc + i.quantity, 0));

  filteredItems = computed(() => {
    if (this.selectedCategory() === 'All') return this.catalog();
    return this.catalog().filter((i: { category: string; }) => i.category === this.selectedCategory());
  });

  addToCart(item: RewardItem) {
    const c = this.activeCustomer();
    if (c) {
      this.dataService.addToCart(c.id, item);
    }
  }

}

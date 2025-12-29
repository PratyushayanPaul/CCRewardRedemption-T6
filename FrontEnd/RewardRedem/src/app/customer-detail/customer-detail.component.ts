import { Component, computed, signal } from '@angular/core';
import { Customer, DataService } from '../data-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent {
  // route = inject(ActivatedRoute);


  // dataService = inject(DataService);


  customerId = signal<string | null>(null);
  activeHistoryTab = signal<'transactions' | 'redemptions'>('transactions');
  
  newCardNumber = '';
  newCardBank = '';
  cardError = signal('');

  customer = computed(() => {
    const id = this.customerId();
    if (!id) return null;
    return this.dataService.getCustomerById(id)();
  });

  customerOrders = computed(() => {
    const cId = this.customerId();
    if (!cId) return [];
    // Return orders for this customer, sorted new to old
    return this.dataService.orders()
      .filter((o: { customerId: string; }) => o.customerId === cId)
      .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  constructor(private dataService : DataService, private route : ActivatedRoute) {
    this.route.paramMap.subscribe((params: { get: (arg0: string) => string | null; }) => {
      this.customerId.set(params.get('id'));
    });
  }

  getCustomerType(c: Customer): string {
    const join = new Date(c.joinDate);
    const now = new Date();
    const diff = (now.getTime() - join.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return diff >= 3 ? 'Premium' : 'Regular';
  }

  getEarnRate(c: Customer): string {
    return this.getCustomerType(c) === 'Premium' ? '10%' : '5%';
  }

  getBadgeClass(c: Customer): string {
    return this.getCustomerType(c) === 'Premium' 
      ? 'inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800' 
      : 'inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800';
  }

  getPoints(c: Customer): number {
    return this.dataService.calculatePoints(c);
  }

  getTotalSpend(c: Customer): number {
    return c.transactions.reduce((acc, t) => acc + t.amount, 0);
  }

  addCard(id: string) {
    if (!this.newCardNumber || !this.newCardBank) {
      this.cardError.set('Fill both fields');
      return;
    }
    try {
      this.dataService.addCard(id, this.newCardNumber, this.newCardBank);
      this.newCardNumber = '';
      this.newCardBank = '';
      this.cardError.set('');
    } catch (e: any) {
      this.cardError.set(e.message);
    }
  }

  generateTransactions(id: string) {
    this.dataService.generateTransactions(id);
  }

  setActiveCustomer(id: string) {
    this.dataService.activeCustomerId.set(id);
  }
}

import { Component, computed } from '@angular/core';
import { DataService } from '../data-service.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  // imports: [RouterLink, CommonModule],
})
export class DashboardComponent {
  // dataService = inject(DataService);

  constructor(private  dataService : DataService){

  }

  customers = this.dataService.getAllCustomers();
  
  totalCustomers = computed(() => this.customers().length);
  totalTransactions = computed(() => this.customers().reduce((sum, c) => sum + c.transactions.length, 0));

}

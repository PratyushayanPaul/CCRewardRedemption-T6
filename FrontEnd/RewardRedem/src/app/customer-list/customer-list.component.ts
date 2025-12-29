import { Component, computed, signal } from '@angular/core';
import { DataService } from '../data-service.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent {
  // dataService = inject(DataService);


constructor(private dataService :DataService ){

}

  customers = this.dataService.getAllCustomers();
  
  searchTerm = signal('');
  showModal = signal(false);
  
  // Form signals
  newName = signal('');
  newEmail = signal('');
  newJoinDate = signal('');

  filteredCustomers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.customers().filter((c: { name: string; email: string; }) => 
      c.name.toLowerCase().includes(term) || 
      c.email.toLowerCase().includes(term)
    );
  });

  getCustomerType(joinDate: string): string {
    const join = new Date(joinDate);
    const now = new Date();
    const diff = (now.getTime() - join.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return diff >= 3 ? 'Premium' : 'Regular';
  }

  getBadgeClass(joinDate: string): string {
    const type = this.getCustomerType(joinDate);
    return type === 'Premium' 
      ? 'inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800'
      : 'inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800';
  }

  createCustomer() {
    const name = this.newName();
    const email = this.newEmail();
    const joinDate = this.newJoinDate();

    if (name && email && joinDate) {
      this.dataService.createCustomer(name, email, joinDate);
      
      // Reset and close
      this.newName.set('');
      this.newEmail.set('');
      this.newJoinDate.set('');
      this.showModal.set(false);
    }
  }

  deleteCustomer(id: string) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.dataService.deleteCustomer(id);
    }
  }

}

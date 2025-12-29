import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { CreditCardDTO, CustomerDTO } from '../models';

@Component({
  selector: 'app-customer-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Search & Controls -->
      <div class="bg-white p-4 rounded-lg shadow border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div class="flex gap-2 w-full md:w-auto">
          <input 
            type="number" 
            placeholder="Search by Customer ID..." 
            class="px-3 py-2 border rounded text-sm w-full md:w-64 bg-white text-slate-900 placeholder-slate-400"
            [(ngModel)]="searchId"
            (keyup.enter)="searchById()"
          />
          <button (click)="searchById()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
            Search
          </button>
        </div>

        <div class="flex gap-2 w-full md:w-auto">
          <button (click)="resetView()" class="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium">
            Refresh All
          </button>
          <button (click)="openRegisterModal()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2">
            <span>+</span> New Customer
          </button>
        </div>
      </div>

      <!-- Customer List -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        @for (customer of api.customers(); track getCustomerId(customer)) {
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-5">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-bold text-slate-800">{{ customer.customerFirstName }} {{ customer.customerLastName }}</h3>
                  <div class="text-slate-500 text-sm flex flex-col gap-1 mt-1">
                    <span>{{ customer.customerEmail }}</span>
                    @if(customer.customerPhone) { <span class="text-xs text-slate-400">Ph: {{ customer.customerPhone }}</span> }
                    <div class="flex gap-3 text-xs text-slate-400 mt-1">
                      @if(customer.customerDOJ) { <span>Joined: {{ customer.customerDOJ }}</span> }
                      @if(customer.customerDOB) { <span>Born: {{ customer.customerDOB }}</span> }
                    </div>
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                     <span class="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">ID: {{ getCustomerId(customer) ?? 'NULL' }}</span>
                     @if (customer.customerStatus === 'ACTIVE') {
                        <span class="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">ACTIVE</span>
                     }
                  </div>
                </div>
                <button (click)="deleteCustomer(customer)" class="text-red-400 hover:text-red-600 p-1" title="Delete Customer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>

              <div class="mt-4 pt-4 border-t border-slate-100">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Credit Cards</span>
                  <button (click)="openAddCard(getCustomerId(customer)!)" class="text-xs text-blue-600 hover:underline font-medium">+ Add Card</button>
                </div>
                
                @if (customer.creditCards && customer.creditCards.length > 0) {
                  <ul class="space-y-2">
                    @for (card of customer.creditCards; track card.creditCardNumber) {
                      <li class="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-2 py-1.5 rounded border border-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-slate-400">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                        </svg>
                        <span class="font-mono">{{ card.creditCardNumber }}</span>
                        @if (card.creditCardExpiry) { <span class="text-xs text-slate-500 bg-white border px-1 rounded">{{ card.creditCardExpiry | date:'MM/yyyy' }}</span> }
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="text-xs text-slate-400 italic">No cards linked.</p>
                }
              </div>
            </div>
          </div>
        } @empty {
           <div class="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded border border-dashed border-slate-300">
             @if (api.loading()) {
                Loading customers...
             } @else {
                No ACTIVE customers found. Try adding one or searching by ID.
             }
           </div>
        }
      </div>

      <!-- Register Modal -->
      @if (showRegisterModal()) {
        <div class="fixed inset-0 bg-white/90 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h2 class="text-xl font-bold mb-4 text-slate-900">Register New Customer</h2>
            <form [formGroup]="custForm" (ngSubmit)="submitCustomer()">
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <input formControlName="firstName" type="text" placeholder="First Name" class="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                  <input formControlName="lastName" type="text" placeholder="Last Name" class="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                </div>
                <input formControlName="email" type="email" placeholder="Email" class="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <input formControlName="phoneNumber" type="tel" placeholder="Phone" class="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                
                <div class="grid grid-cols-2 gap-3">
                   <!-- Date of Birth Field -->
                  <div class="relative">
                    <input formControlName="customerDOB" type="date" class="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pt-4 h-11">
                    <label class="absolute top-0.5 left-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                  </div>

                  <!-- Date of Joining Field -->
                  <div class="relative">
                    <input formControlName="customerDOJ" type="date" class="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pt-4 h-11">
                    <label class="absolute top-0.5 left-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date Joined</label>
                  </div>
                </div>

              </div>
              <div class="mt-6 flex justify-end gap-2">
                <button type="button" (click)="showRegisterModal.set(false)" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded text-sm">Cancel</button>
                <button type="submit" [disabled]="custForm.invalid" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">Register</button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Add Card Modal -->
      @if (showCardModal()) {
        <div class="fixed inset-0 bg-white/90 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h2 class="text-xl font-bold mb-4 text-slate-900">Add Credit Card</h2>
            <p class="text-sm text-slate-500 mb-4">Adding card for Customer ID: {{ activeCustomerId() }}</p>
            <form [formGroup]="cardForm" (ngSubmit)="submitCard()">
              <div class="space-y-3">
                <div>
                   <input formControlName="creditCardNumber" type="text" placeholder="Card Number (Min 12 digits)" class="w-full border border-slate-300 rounded px-3 py-2 text-sm font-mono bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" [class.border-red-300]="cardForm.get('creditCardNumber')?.invalid && cardForm.get('creditCardNumber')?.touched">
                   @if (cardForm.get('creditCardNumber')?.invalid && cardForm.get('creditCardNumber')?.touched) {
                     <p class="text-xs text-red-500 mt-1">Number must be at least 12 digits.</p>
                   }
                </div>
                
                <input formControlName="creditCardHolderName" type="text" placeholder="Card Holder Name" class="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                
                <div class="flex gap-3">
                  <!-- Expiry Date -->
                  <div class="relative w-1/2">
                    <input formControlName="creditCardExpiry" type="month" class="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none pt-4 h-11">
                    <label class="absolute top-0.5 left-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expiry</label>
                  </div>
                  <!-- CVV Field -->
                  <input formControlName="creditCardCvv" type="number" placeholder="CVV" class="w-1/2 border border-slate-300 rounded px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none h-11 mt-auto">
                </div>
              </div>
              <div class="mt-6 flex justify-end gap-2">
                <button type="button" (click)="showCardModal.set(false)" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded text-sm">Cancel</button>
                <button type="submit" [disabled]="cardForm.invalid" class="px-4 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors">Add Card</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class CustomerManagerComponent {
  api = inject(ApiService);
  fb = inject(FormBuilder);

  searchId: number | null = null;
  
  showRegisterModal = signal(false);
  showCardModal = signal(false);
  activeCustomerId = signal<number | null>(null);

  custForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    customerDOJ: [new Date().toISOString().split('T')[0], Validators.required],
    customerDOB: ['', Validators.required]
  });

  cardForm: FormGroup = this.fb.group({
    creditCardNumber: ['', [Validators.required, Validators.minLength(12)]],
    creditCardHolderName: ['', Validators.required],
    creditCardExpiry: ['', Validators.required],
    creditCardCvv: ['', Validators.required]
  });

  constructor() {
    this.api.getAllCustomers();
  }

  // Helper to extract ID safely
  getCustomerId(customer: CustomerDTO): number | undefined {
    return customer.customerId ?? customer.customerID ?? customer.customerid ?? customer.customer_id;
  }

  resetView() {
    this.searchId = null;
    this.api.getAllCustomers();
    this.api.clearError();
  }

  searchById() {
    if (this.searchId) {
      this.api.getCustomerById(this.searchId);
    }
  }

  deleteCustomer(customer: CustomerDTO) {
    const id = this.getCustomerId(customer);
    
    if (id === undefined || id === null) {
      alert('Error: Customer ID is missing from the record.');
      return;
    }

    if (confirm(`Are you sure you want to delete ${customer.customerFirstName} (ID: ${id})?`)) {
      this.api.deleteCustomer(id).subscribe({
        next: (msg) => {
          alert(msg);
          // Refresh list to remove deleted item
          if (this.searchId) {
             this.searchId = null;
             this.api.getAllCustomers();
          }
        },
        error: (err) => alert(`Delete failed: ${err.message}`)
      });
    }
  }

  openRegisterModal() {
    this.api.clearError();
    this.custForm.reset({
      customerDOJ: new Date().toISOString().split('T')[0],
      customerDOB: ''
    });
    this.showRegisterModal.set(true);
  }

  submitCustomer() {
    this.api.clearError();
    if (this.custForm.valid) {
      const formVal = this.custForm.value;
      const dto: CustomerDTO = {
        customerFirstName: formVal.firstName,
        customerLastName: formVal.lastName,
        customerEmail: formVal.email,
        customerPhone: formVal.phoneNumber,
        customerDOJ: formVal.customerDOJ,
        customerDOB: formVal.customerDOB,
        customerStatus: 'ACTIVE'
      };

      this.api.registerCustomer(dto).subscribe({
        next: (id) => {
          alert(`Customer Registered! ID: ${id}`);
          this.showRegisterModal.set(false);
          this.custForm.reset();
          
          // Force switch to the new customer to verify details
          this.searchId = id;
          this.searchById();
        },
        error: (err) => {
          console.error(err);
          alert(`Registration Failed: ${err.status} ${err.statusText}`);
        }
      });
    }
  }

  openAddCard(custId: number) {
    this.api.clearError();
    this.activeCustomerId.set(custId);
    this.cardForm.reset();
    this.showCardModal.set(true);
  }

  submitCard() {
    this.api.clearError();
    if (this.cardForm.valid && this.activeCustomerId()) {
      const formVal = this.cardForm.value;
      const targetId = this.activeCustomerId()!;

      // TRANSFORM DATE: YYYY-MM -> YYYY-MM-01
      let formattedDate = formVal.creditCardExpiry;
      if (formattedDate && formattedDate.length === 7) {
         formattedDate += '-01';
      }
      
      const dto: CreditCardDTO = { 
        creditCardNumber: formVal.creditCardNumber,
        creditCardHolderName: formVal.creditCardHolderName,
        creditCardExpiry: formattedDate,
        creditCardCvv: Number(formVal.creditCardCvv),
        customerId: targetId
      };
      
      this.api.addCreditCard(targetId, dto).subscribe({
        next: (msg) => {
          alert(msg);
          this.showCardModal.set(false);
          this.cardForm.reset();

          // CRITICAL FIX: Always fetch the specific customer after adding a card.
          // This ensures the /getCC endpoint is called to hydrate the card list.
          setTimeout(() => {
             this.searchId = targetId;
             this.api.getCustomerById(targetId);
          }, 500);
        },
        error: (err) => {
          console.error(err);
          alert(`Add Card Failed: ${err.status} ${err.statusText}`);
        }
      });
    }
  }
}
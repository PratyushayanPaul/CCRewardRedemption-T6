import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transaction-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Search & Controls -->
      <div class="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h2 class="text-lg font-semibold mb-4 text-slate-700">Manage Transactions</h2>
        <div class="flex flex-col md:flex-row gap-4 items-end">
          <div class="w-full md:w-96">
            <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Credit Card Number</label>
            <div class="flex gap-2">
              <input 
                type="text" 
                [(ngModel)]="searchCardNum"
                placeholder="Enter card number..." 
                class="flex-1 px-3 py-2 border border-slate-300 rounded text-sm font-mono bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
            </div>
          </div>
          
          <div class="flex gap-2">
            <button (click)="loadTransactions()" [disabled]="!searchCardNum" class="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-5 py-2 rounded text-sm font-medium transition-colors">
              Fetch Transactions
            </button>
            <button (click)="generateTransactions()" [disabled]="!searchCardNum" class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-5 py-2 rounded text-sm font-medium transition-colors">
              Generate 50 New
            </button>
          </div>

          <div class="w-full md:w-auto md:ml-auto md:border-l md:pl-4 border-slate-200">
             <label class="block text-xs font-semibold text-slate-500 uppercase mb-1">Search by TxID</label>
             <div class="flex gap-2">
               <input [(ngModel)]="searchTxId" type="number" placeholder="ID" class="w-24 px-3 py-2 border border-slate-300 rounded text-sm bg-white text-slate-900 placeholder-slate-400">
               <button (click)="findTx()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded border border-slate-300">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                 </svg>
               </button>
             </div>
          </div>
        </div>
      </div>

      <!-- Transaction List -->
      <div class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th class="px-6 py-3">Tx ID</th>
                <th class="px-6 py-3">Date</th>
                <th class="px-6 py-3">Description</th>
                <th class="px-6 py-3">Card Number</th>
                <th class="px-6 py-3 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (tx of currentTransactions(); track tx.transactionId) {
                <tr class="hover:bg-slate-50">
                  <td class="px-6 py-3 font-mono text-slate-600">#{{ tx.transactionId }}</td>
                  <td class="px-6 py-3">{{ tx.transactionDate }}</td>
                  <td class="px-6 py-3">{{ tx.description }}</td>
                  <td class="px-6 py-3 font-mono text-xs">{{ tx.creditCardNumber }}</td>
                  <td class="px-6 py-3 text-right font-medium" [class.text-red-600]="tx.amount > 10000" [class.text-emerald-600]="tx.amount <= 10000">
                    {{ tx.amount | currency:'INR' }}
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                    No transactions to display. Enter a card number to fetch or generate data.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        @if (totalItems() > 0) {
          <div class="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
            <!-- Mobile view -->
            <div class="flex flex-1 justify-between sm:hidden">
              <button (click)="prevPage()" [disabled]="currentPage() === 1" class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button (click)="nextPage()" [disabled]="currentPage() === totalPages()" class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
            
            <!-- Desktop view -->
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ (currentPage() - 1) * pageSize + 1 }}</span>
                  to
                  <span class="font-medium">{{ getEndIndex() }}</span>
                  of
                  <span class="font-medium">{{ totalItems() }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button (click)="prevPage()" [disabled]="currentPage() === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  
                  <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0 bg-white">
                    Page {{ currentPage() }} of {{ totalPages() }}
                  </span>
                  
                  <button (click)="nextPage()" [disabled]="currentPage() === totalPages()" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="sr-only">Next</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class TransactionManagerComponent {
  api = inject(ApiService);
  searchCardNum = '';
  searchTxId: number | null = null;
  
  // Pagination State
  currentPage = signal(1);
  pageSize = 50;

  // Derived State
  totalItems = computed(() => this.api.transactions().length);
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize) || 1);
  
  currentTransactions = computed(() => {
    const txs = this.api.transactions();
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return txs.slice(start, end);
  });

  loadTransactions() {
    if (this.searchCardNum) {
      this.currentPage.set(1);
      this.api.getTransactionsByCard(this.searchCardNum);
    }
  }

  generateTransactions() {
    if (this.searchCardNum) {
      this.api.generateTransactions(this.searchCardNum).subscribe(() => {
        alert('Transactions generated successfully!');
        this.currentPage.set(1);
      });
    }
  }

  findTx() {
    if (this.searchTxId) {
      this.api.getTransactionById(this.searchTxId);
      this.currentPage.set(1); // Reset pagination for single result
    }
  }

  // Pagination Controls
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  getEndIndex() {
    return Math.min(this.currentPage() * this.pageSize, this.totalItems());
  }
}
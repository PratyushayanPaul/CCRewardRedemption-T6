import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap, switchMap } from 'rxjs/operators';
import { CustomerDTO, CreditCardDTO, TransactionDTO } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  
  // Dynamic Base URL with persistence. Defaulting to 9090 as requested.
  baseUrl = signal<string>(localStorage.getItem('api_url') || 'http://localhost:9090');

  // State signals
  customers = signal<CustomerDTO[]>([]);
  transactions = signal<TransactionDTO[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Connection Status Tracking
  isMockMode = signal<boolean>(false);

  // MOCK DATA STORE
  private mockCustomers: CustomerDTO[] = [
    { 
      customerId: 101, 
      customerFirstName: 'John', 
      customerLastName: 'Doe', 
      customerEmail: 'john.doe@example.com', 
      customerStatus: 'ACTIVE', 
      creditCards: [
        { creditCardNumber: '1234-5678-9012-3456', creditCardHolderName: 'John Doe', creditCardExpiry: '2025-12-31', creditCardCvv: 123 }
      ] 
    },
    { customerId: 102, customerFirstName: 'Jane', customerLastName: 'Smith', customerEmail: 'jane.smith@example.com', customerStatus: 'ACTIVE', creditCards: [] },
    { customerId: 103, customerFirstName: 'Inactive', customerLastName: 'User', customerEmail: 'inactive@test.com', customerStatus: 'INACTIVE', creditCards: [] }
  ];
  private mockTransactions: TransactionDTO[] = [
    { transactionId: 5001, creditCardNumber: '1234-5678-9012-3456', amount: 1200.50, transactionDate: '2023-10-10', description: 'BigBasket Grocery' },
    { transactionId: 5002, creditCardNumber: '1234-5678-9012-3456', amount: 4500.00, transactionDate: '2023-10-11', description: 'Indian Oil Petrol' }
  ];

  updateBaseUrl(newUrl: string) {
    // Remove trailing slash if present
    const cleanUrl = newUrl.replace(/\/$/, '');
    this.baseUrl.set(cleanUrl);
    localStorage.setItem('api_url', cleanUrl);
    // Refresh data with new URL
    this.getAllCustomers();
  }

  // --- Helper: Robust Data Normalization ---

  private normalizeCards(data: any, defaultCustomerId?: number): CreditCardDTO[] {
    if (!data) return [];

    // 1. Identify List Structure
    let list: any[] = [];
    if (Array.isArray(data)) {
        list = data;
    } else if (Array.isArray(data.cards)) {
        list = data.cards;
    } else if (Array.isArray(data.content)) {
        list = data.content;
    } else if (Array.isArray(data.creditCards)) {
        list = data.creditCards;
    } else if (typeof data === 'object' && (data.creditCardNumber || data.cardNumber || data.card_number || data.ccNumber)) {
        // Handle case where backend returns single object instead of array
        list = [data];
    } else {
        // Try getting values if it's a map
        list = Object.values(data).filter(v => typeof v === 'object' && v !== null) as any[];
    }
    
    return list.map((c: any) => {
      // 2. Handle Date Arrays (Spring Boot LocalDate serialization [YYYY, MM, DD])
      let expiry = c.creditCardExpiry || c.expiryDate || c.expirationDate || c.expiry_date || '';
      if (Array.isArray(expiry)) {
         const y = expiry[0];
         const m = String(expiry[1]).padStart(2, '0');
         const d = String(expiry[2]).padStart(2, '0');
         expiry = `${y}-${m}-${d}`;
      }

      return {
        creditCardNumber: c.creditCardNumber || c.cardNumber || c.card_number || c.credit_card_number || c.ccNumber || c.cardNum || 'UNKNOWN',
        creditCardHolderName: c.creditCardHolderName || c.holderName || c.cardHolderName || c.bankName || c.credit_card_holder_name || c.name || '',
        creditCardCvv: Number(c.creditCardCvv || c.cvv || c.cvc || c.credit_card_cvv || 0),
        creditCardExpiry: expiry,
        customerId: c.customerId || defaultCustomerId
      };
    });
  }

  private normalizeCustomer(item: any): CustomerDTO {
    if (!item) return item;

    // 1. Resolve ID
    const id = item.customerID ?? item.customerId ?? item.customerid ?? item.customer_id ?? item.id;
    
    // 2. Resolve Fields
    const firstName = item.customerFirstName ?? item.firstName ?? item.first_name ?? item.fname ?? '';
    const lastName = item.customerLastName ?? item.lastName ?? item.last_name ?? item.lname ?? '';
    const email = item.customerEmail ?? item.email ?? item.emailAddress ?? item.mail ?? '';
    const phone = item.customerPhone ?? item.phoneNumber ?? item.phone ?? item.mobile ?? item.contactNumber ?? '';
    
    // 3. Normalize Status
    const rawStatus = item.customerStatus ?? item.status ?? 'ACTIVE';
    const status = String(rawStatus).toUpperCase();

    // 4. Resolve Dates (Handle Arrays too)
    let dob = item.customerDOB ?? item.dob ?? item.dateOfBirth ?? item.birthDate ?? '';
    if (Array.isArray(dob)) dob = `${dob[0]}-${String(dob[1]).padStart(2,'0')}-${String(dob[2]).padStart(2,'0')}`;

    let doj = item.customerDOJ ?? item.doj ?? item.dateOfJoining ?? item.joiningDate ?? '';
    if (Array.isArray(doj)) doj = `${doj[0]}-${String(doj[1]).padStart(2,'0')}-${String(doj[2]).padStart(2,'0')}`;

    // 5. Resolve Nested Cards
    // Check multiple potential keys for nested card lists
    let rawCards = item.creditCards || item.credit_cards || item.creditCard || item.credit_card || item.cards || item.cardList || [];
    const mappedCards = this.normalizeCards(rawCards, id);

    return {
      customerId: id, 
      customerFirstName: firstName,
      customerLastName: lastName,
      customerEmail: email,
      customerPhone: phone,
      customerDOB: dob,
      customerDOJ: doj,
      customerStatus: status,
      creditCards: mappedCards
    };
  }

  // --- Customer Controller Endpoints ---

  getAllCustomers() {
    this.loading.set(true);
    const url = `${this.baseUrl()}/CCReward/allcustomer?t=${Date.now()}`;
    console.log(`[API] Fetching all customers from: ${url}`);

    this.http.get<any>(url).pipe(
      map(response => {
        let data: any[] = [];
        if (Array.isArray(response)) {
          data = response;
        } else if (response && Array.isArray(response.content)) {
          data = response.content;
        } else if (response && response._embedded && Array.isArray(response._embedded.customerDTOList)) {
           data = response._embedded.customerDTOList;
        } else {
           const possibleArray = Object.values(response).find(val => Array.isArray(val));
           if (possibleArray) data = possibleArray as any[];
        }

        return data.map(item => this.normalizeCustomer(item));
      }),
      tap((data) => {
        this.isMockMode.set(false);
        this.error.set(null);
        console.log(`[API] Loaded ${data.length} customers.`);
      }),
      catchError((err) => {
        console.warn('[API] Connection failed. Switching to Mock Mode.', err);
        this.isMockMode.set(true);
        if (err.status !== 0) {
           this.error.set(`Backend Error: ${err.status} ${err.statusText}`);
        }
        return of(this.mockCustomers).pipe(delay(500));
      })
    ).subscribe({
      next: (data) => {
        const activeCustomers = data.filter(c => c.customerStatus === 'ACTIVE');
        this.customers.set(activeCustomers);
        this.loading.set(false);
      },
      error: (err) => this.handleError(err)
    });
  }

  getCustomerById(id: number) {
    this.loading.set(true);
    this.customers.set([]); 

    const customerUrl = `${this.baseUrl()}/CCReward/${id}?t=${Date.now()}`;
    
    this.http.get<any>(customerUrl).pipe(
      map(item => this.normalizeCustomer(item)),
      switchMap(customer => {
        if (!customer) return of(null);
        
        // Fetch cards explicitly
        const cardsUrl = `${this.baseUrl()}/CCReward/getCC/${id}?t=${Date.now()}`;
        console.log(`[API] Fetching cards for ID ${id} from: ${cardsUrl}`);

        return this.http.get<any>(cardsUrl).pipe(
          map(response => {
             const safeCards = this.normalizeCards(response, id);
             console.log(`[API] Cards found for ${id}:`, safeCards);
             // Merge with any existing cards from the customer object, avoiding duplicates by Number
             const existingCards = customer.creditCards || [];
             const mergedCards = [...existingCards];
             
             safeCards.forEach(newCard => {
               if (!mergedCards.some(e => e.creditCardNumber === newCard.creditCardNumber)) {
                 mergedCards.push(newCard);
               }
             });
             
             return { ...customer, creditCards: mergedCards };
          }),
          catchError(err => {
             console.warn('[API] Card fetch failed (likely empty or 404).', err);
             return of(customer);
          })
        );
      }),
      catchError((err) => {
        if (this.isMockMode() || err.status === 0) {
           const found = this.mockCustomers.find(c => c.customerId == id);
           return found ? of(found).pipe(delay(500)) : throwError(() => new Error('Not found locally'));
        }
        return throwError(() => err);
      })
    ).subscribe({
      next: (data) => {
        if (data && data.customerStatus === 'ACTIVE') {
           this.customers.set([data]);
           this.error.set(null);
        } else if (data) {
           this.customers.set([]);
           this.error.set(`Customer ${id} is ${data.customerStatus} (Not ACTIVE)`);
        } else {
           this.customers.set([]);
           this.error.set(`Customer ID ${id} not found.`);
        }
        this.loading.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
             this.customers.set([]);
             this.error.set(`Customer ID ${id} not found.`);
             this.loading.set(false);
        } else {
             this.handleError(err);
        }
      }
    });
  }

  registerCustomer(dto: CustomerDTO): Observable<number> {
    this.loading.set(true);
    if (this.isMockMode()) {
        const newId = Math.floor(Math.random() * 1000) + 200;
        this.mockCustomers.push({ ...dto, customerId: newId, creditCards: [] });
        return of(newId).pipe(
            delay(500),
            tap(() => {
                this.loading.set(false);
                this.getAllCustomers();
            })
        );
    }

    return this.http.post<number>(`${this.baseUrl()}/CCReward`, dto).pipe(
      tap(() => {
        this.loading.set(false);
        this.getAllCustomers();
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  deleteCustomer(customerId: number): Observable<string> {
    const url = `${this.baseUrl()}/CCReward/delete/${customerId}`;
    this.loading.set(true);

    if (this.isMockMode()) {
        this.mockCustomers = this.mockCustomers.filter(c => c.customerId !== customerId);
        return of(`Deleted ${customerId} (MOCK)`).pipe(delay(500), tap(() => { this.loading.set(false); this.getAllCustomers(); }));
    }

    return this.http.put(url, {}, { responseType: 'text' }).pipe(
      tap(() => {
        this.loading.set(false);
        this.getAllCustomers();
      }),
      catchError((err) => {
        this.loading.set(false);
        if (err.status === 200) return of("Deleted Successfully");
        if (err.status === 0) return throwError(() => new Error('Connection Refused'));
        return throwError(() => err);
      })
    );
  }

  addCreditCard(customerId: number, dto: CreditCardDTO): Observable<string> {
    this.loading.set(true);
    const url = `${this.baseUrl()}/CCReward/addCC/${customerId}`;

    if (this.isMockMode()) {
        const cust = this.mockCustomers.find(c => c.customerId === customerId);
        if (cust) {
           if(!cust.creditCards) cust.creditCards = [];
           cust.creditCards.push(dto);
        }
        return of("Card Added (MOCK)").pipe(delay(500), tap(() => { this.loading.set(false); }));
    }

    return this.http.put(url, dto, { responseType: 'text' }).pipe(
      tap(() => this.loading.set(false)),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  generateTransactions(creditCardNumber: string): Observable<TransactionDTO[]> {
    this.loading.set(true);
    if (this.isMockMode()) {
        return of([]).pipe(delay(500), tap(() => this.getTransactionsByCard(creditCardNumber)));
    }

    return this.http.post<TransactionDTO[]>(`${this.baseUrl()}/generate/${creditCardNumber}`, {}).pipe(
      tap(() => {
        this.getTransactionsByCard(creditCardNumber);
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  getTransactionsByCard(creditCardNumber: string) {
    this.loading.set(true);
    const url = `${this.baseUrl()}/card/${creditCardNumber}?t=${Date.now()}`;
    
    this.http.get<any>(url).pipe(
      map(response => {
        if (Array.isArray(response)) return response;
        return response?.content || response?.transactions || [];
      }),
      catchError((err) => {
        if (this.isMockMode()) {
            return of(this.mockTransactions.filter(t => t.creditCardNumber === creditCardNumber)).pipe(delay(500));
        }
        return throwError(() => err);
      })
    ).subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.loading.set(false);
      },
      error: (err) => this.handleError(err)
    });
  }

  getTransactionById(id: number) {
    this.loading.set(true);
    const url = `${this.baseUrl()}/${id}?t=${Date.now()}`;

    this.http.get<any>(url).pipe(
      catchError((err) => {
        if (this.isMockMode()) {
             const tx = this.mockTransactions.find(t => t.transactionId == id);
             return tx ? of(tx).pipe(delay(500)) : throwError(() => new Error('Not found'));
        }
        return throwError(() => err);
      })
    ).subscribe({
      next: (data) => {
        this.transactions.set([data]);
        this.loading.set(false);
      },
      error: (err) => this.handleError(err)
    });
  }

  clearError() {
    this.error.set(null);
  }

  private handleError(err: any) {
    this.loading.set(false);
    this.error.set(err.message || 'An error occurred');
    console.error('API Error:', err);
    setTimeout(() => this.error.set(null), 8000);
  }
}
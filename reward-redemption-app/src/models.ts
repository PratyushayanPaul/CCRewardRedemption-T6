export interface CustomerDTO {
  customerID?: number; // Primary ID field as per backend
  customerId?: number; // Fallback
  customerid?: number; // Fallback
  customer_id?: number; // Fallback
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone?: string;
  customerDOJ?: string; // Date of Joining (YYYY-MM-DD)
  customerDOB?: string; // Date of Birth (YYYY-MM-DD)
  customerStatus?: string; // 'ACTIVE' or 'INACTIVE'
  creditCards?: CreditCardDTO[];
}

export interface CreditCardDTO {
  creditCardNumber: string;
  creditCardHolderName: string;
  creditCardCvv: number;       // Changed to number to match Java Integer
  creditCardExpiry: string;    // String is correct for Java LocalDate (YYYY-MM-DD) in JSON
  customerId?: number;
}

export interface TransactionDTO {
  transactionId: number;
  creditCardNumber: string;
  amount: number;
  transactionDate: string;
  description: string;
  merchant?: string;
}

// Helper for UI state
export type ViewState = 'customers' | 'transactions';
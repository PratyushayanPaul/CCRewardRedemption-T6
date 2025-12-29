import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { CustomerManagerComponent } from './components/customer-manager.component';
import { TransactionManagerComponent } from './components/transaction-manager.component';
import { ViewState } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerManagerComponent, TransactionManagerComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  api = inject(ApiService);
  currentView: ViewState = 'customers';
  
  // Settings UI
  showSettings = signal(false);
  tempUrl = '';

  constructor() {
    this.tempUrl = this.api.baseUrl();
  }

  setView(view: ViewState) {
    this.currentView = view;
  }
  
  openSettings() {
    this.tempUrl = this.api.baseUrl();
    this.showSettings.set(true);
  }

  saveSettings() {
    this.api.updateBaseUrl(this.tempUrl);
    this.showSettings.set(false);
  }
}
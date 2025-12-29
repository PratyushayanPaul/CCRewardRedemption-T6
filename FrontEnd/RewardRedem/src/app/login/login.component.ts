import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  error = signal('');

  constructor(private dataService :DataService, private router : Router ){

  }
  
  // dataService = inject();
  // router = inject(Router);

  onLogin() {
    if (this.dataService.login(this.username, this.password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error.set('Invalid credentials.');
    }
  }

}

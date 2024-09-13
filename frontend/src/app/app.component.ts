import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Real-Estate';
  userData: any = localStorage.getItem('user');
  userObj = JSON.parse(this.userData);
  constructor(private router: Router) {}

  showNavbar(): boolean {
    if (this.router.url !== '/login' && this.router.url !== '/register' && this.router.url !== '/forget-password') {
      return true
    }
    return false;

  }

}

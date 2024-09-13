import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PremiumBuyComponent } from '../premium-buy/premium-buy.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog
  ){
    
  }

  checkAdmin(): boolean {
    const userData:any = localStorage.getItem('user');
    const userObj = JSON.parse(userData)
    if (userObj?.type == 0) {
      return true;
    }
    return false;
  }

  checkUser(): boolean {
    const userData:any = localStorage.getItem('user');
    const userObj = JSON.parse(userData)
    if (userObj?.type == 2) {
      return true;
    }
    return false;
  }

  logout(): any {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  editUser(): void {
    const userData:any = localStorage.getItem('user');
    const userObject = JSON.parse(userData);
    this.router.navigate(['/profile/'+ userObject.id]);
  }

  onClickBuy(): void {
    // if (this.userObj.type === 2) {
    //   return;
    // } else {
      const dialogRef = this.dialog.open(PremiumBuyComponent, {
        data: ''
      });

      dialogRef.afterClosed().subscribe(() => {
        // this.fetchData();
      });
    // }
  }

}

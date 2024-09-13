import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent {
  // isChecked = false;
  userList: any;
  displayedColumns: string[] = ['acc_name', 'phone', 'transaction_id', 'pay_amount', 'user_id', 'user_name', 'user_type'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private userSvc: UserService,
    private loadingSvc: LoadingService,
    private router: Router,
    private dialog: MatDialog
  ) {
    const userData: any = localStorage.getItem('user');
    const userObject = JSON.parse(userData);
    if (userObject.type !== 0) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.fetchUserList();
    this.fetchTransactionList();
  }

  fetchTransactionList(): void {
    this.userSvc.getTransacList().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource<any>(response);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  fetchUserList(): void {
    this.userSvc.getUserList().subscribe({
      next: (response) => {
        this.userList = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  editUser(id: number): void {
    // const userData:any = localStorage.getItem('user');
    // const userObject = JSON.parse(userData);
    this.router.navigate(['/user/' + id]);
  }
  showUserType(userId: number) {
    for (const user of this.userList) {
      if (user.id === userId) {
        if (user.type === 0) {
          return 'Admin';
        } else if (user.type === 1) {
          return 'Premium';
        } else {
          return 'Normal';
        }
      }
    }
    // Handle the case where the user with the specified ID was not found.
    return 'User Not Found';
  }

  showUserName(userId: number) {
    for (const user of this.userList) {
      if (user.id === userId) {
        return user.name;
      }
    }
    // Handle the case where the user with the specified ID was not found.
    return 'User Not Found';
  }

  onChangeToggle(userId: number, checkedValue:boolean) {
    this.loadingSvc.showLoading();
    const typeNumber = checkedValue == true ? 1 : 2;
    this.userSvc.updateUserType(userId, typeNumber).subscribe({
      next: () => {

        this.fetchUserList();
        this.fetchTransactionList();
        this.loadingSvc.hideLoading();
      },
      error: (error) => {
        this.loadingSvc.hideLoading();
        console.error(error);
      }
    });
  }

  checkUserType(userId:number){
    for (const user of this.userList) {
      if (user.id === userId) {
        if (user.type === 1) {
          return true;
        } else {
          return false;
        }
      }
    }
    // Handle the case where the user with the specified ID was not found.
    return false;
  }
}

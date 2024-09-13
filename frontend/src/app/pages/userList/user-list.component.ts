import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/components/confirmDialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user/user.service';
import { ErrorDialogComponent } from 'src/app/components/errorDialog/error-dialog.component';
import { LoadingService } from 'src/app/services/loading/loading.service';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  
  userData: any = localStorage.getItem('user');
  userObj = JSON.parse(this.userData);
  userTypes = [
    {id: 0, name: 'Admin'},
    {id:1, name: 'Premium'},
    {id:2, name: 'Normal'}
  ]
  displayedColumns: string[] = ['name', 'email', 'type', 'address', 'phone', 'actions'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userSvc: UserService,
    private loadingSvc: LoadingService,
    private router: Router,
    private dialog: MatDialog
  ) {
    const userData:any = localStorage.getItem('user');
    const userObject = JSON.parse(userData);
    if(userObject.type !== 0) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.fetchUserList();
  }

  fetchUserList(): void {
    this.userSvc.getUserList().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource<any>(response);
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  createUser(): void {
    this.router.navigate(['/create-user']);
  }

  editUser(userId: number): void {
    this.router.navigate(['/user/'+ userId]);
  }

  deleteUser(userId: number): void {
    if (this.userObj.type === 2 ) {
      return;
    } else {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: 'Are you sure?'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.loadingSvc.showLoading();
          this.userSvc.deleteUser(userId).subscribe({
            next: () => {
              this.fetchUserList();
              this.loadingSvc.hideLoading();
            },
            error: (error) => {
              this.loadingSvc.hideLoading();
              console.error(error);
              this.dialog.open(ErrorDialogComponent, {
                data: { errorMessage: 'Cannot delete user.' }
              });
            }
          });
        } else {
          return;
        }
      });
    }
  }

}

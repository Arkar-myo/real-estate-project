import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { UtilService } from 'src/app/services/util.service';
import { MatDialog } from '@angular/material/dialog';
// import { ErrorDialogComponent } from '../errorDialog/error-dialog.component';
import { ErrorDialogComponent } from 'src/app/components/errorDialog/error-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmailVerifyComponent } from 'src/app/components/emailVerify/email-verify.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-user-component',
  templateUrl: './user-component.component.html',
  styleUrls: ['./user-component.component.scss']
})
export class UserComponentComponent {
  registrationForm: FormGroup | any;

  constructor(
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private userSvc: UserService,
    private dialog: MatDialog,
    private loadingSvc: LoadingService) { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, this.utilService.emailValidator]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, this.utilService.phoneValidator()]]
    }, {
      validators: this.utilService.passwordMatchValidator
    });
  }
  
  onSubmit() {
    if (this.registrationForm.valid) {
      this.loadingSvc.showLoading();
      this.userSvc.sendEmail(this.registrationForm.value).subscribe({
        next: () => {
          this.loadingSvc.hideLoading();
          // this.dialog.open(EmailVerifyComponent, {
          //   data: this.registrationForm.value
          // });
          const dialogRef = this.dialog.open(EmailVerifyComponent, {
            data: this.registrationForm.value,
            disableClose: true
          });
        
          dialogRef.afterClosed().subscribe(result => {
            // You can handle the dialog close here if needed
          });
          // this.router.navigate(['/']);
        },
        error: (error: any) => {
          console.error(error);
          this.loadingSvc.hideLoading();
          this.dialog.open(ErrorDialogComponent, {
            data: { errorMessage: 'Cannot register user.' }
          });
        }
      });
    }
  }
}

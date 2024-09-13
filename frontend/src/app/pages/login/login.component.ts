import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/components/errorDialog/error-dialog.component';
import { EmailVerifyComponent } from 'src/app/components/emailVerify/email-verify.component';
import { UtilService } from 'src/app/services/util.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
// import { LoadingDialogService } from 'src/app/services/loading-dialog.service';
// import {MatIconModule} from '@angular/material/icon';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authSvc: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private util: UtilService,
    private loadingSvc: LoadingService
    // private loadingDialogService: LoadingDialogService
  ) {
    // this.loadingSvc.showLoading();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, this.util.emailValidator]],
      password: ['', Validators.required]
    });
  }


  onLogin(): void {
    if (this.loginForm.valid) {
      this.loadingSvc.showLoading();
      this.authSvc.accLogin(this.loginForm.value).subscribe({
        next: (response) => {
          this.loadingSvc.hideLoading();
          const token = response.token;
          localStorage.setItem('token', token);
          const jsonResponse = JSON.stringify(response);
          localStorage.setItem('user', jsonResponse);
          this.router.navigate(['/']);
        },
        error: () => {
          this.loadingSvc.hideLoading();
          this.dialog.open(ErrorDialogComponent, {
            data: { errorMessage: 'Login failed. Please check your credentials.' }
          });
        }
      });
    }
  }

  openRegister():void {
    // this.loadingSvc.showLoading();
    this.router.navigate(['/register']);
  }
  forgetPw() {
    this.router.navigate(['/forget-password']);
  }
}

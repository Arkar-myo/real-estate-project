import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { UserListComponent } from './pages/userList/user-list.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
// import {MatTreeNestedDataSource} from '@angular/material/tree';
import {MatTreeModule} from '@angular/material/tree';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { ErrorDialogComponent } from './components/errorDialog/error-dialog.component';
import { PostComponentComponent } from './components/post-component/post-component.component';
import { PostShowcaseComponent } from './components/post-showcase/post-showcase.component';
import { RegisterComponent } from './pages/register/register.component';
import { EmailVerifyComponent } from './components/emailVerify/email-verify.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ConfirmDialogComponent } from './components/confirmDialog/confirm-dialog.component';
import { MessageDialogComponent } from './components/message-dialog/message-dialog.component';
import { CityComponentComponent } from './components/city-component/city-component.component';
import { PremiumBuyComponent } from './components/premium-buy/premium-buy.component';
import { TransactionListComponent } from './pages/transaction-list/transaction-list.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { PasswordVerifyComponent } from './components/password-verify/password-verify.component';
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    NavbarComponent,
    LoginComponent,
    ErrorDialogComponent,
    PostComponentComponent,
    PostShowcaseComponent,
    RegisterComponent,
    EmailVerifyComponent,
    LoadingComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    CityComponentComponent,
    PremiumBuyComponent,
    TransactionListComponent,
    ForgetPasswordComponent,
    PasswordVerifyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzCardModule,
    NzAvatarModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTreeModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatAutocompleteModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

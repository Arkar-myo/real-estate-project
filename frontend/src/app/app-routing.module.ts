import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserListComponent } from './pages/userList/user-list.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard, RoleGuard } from './services/auth/auth-guard.service';
import { RegisterComponent } from './pages/register/register.component';
import { TransactionListComponent } from './pages/transaction-list/transaction-list.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]  },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard]},
  { path: 'transactions', component: TransactionListComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'create-user', component: RegisterComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'forget-password', component: ForgetPasswordComponent},
  { path: 'user/:id', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: RegisterComponent, canActivate: [AuthGuard] }
  // { path: 'user', component: RegisterComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Headers } from '../httpCommon.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserList(): Observable<any> {
    const headers = Headers;
    return this.http.get<any>('http://localhost:4200/api/user/list', { headers });
  }

  getTransacList(): Observable<any> {
    const headers = Headers;
    return this.http.get<any>('http://localhost:4200/api/user/transaction/list', { headers });
  }

  getUserInfo(userId: any): Observable<any> {
    const headers = Headers;
    return this.http.get<any>('http://localhost:4200/api/user/'+userId, { headers });
  }

  updateUserInfo(userId: any, userInfo:any): Observable<any> {
    const headers = Headers;
    const body = {
      name: userInfo.username,
      email: userInfo.email,
      password: userInfo.password,
      address: userInfo.address,
      phone: userInfo.phone,
      type: userInfo.type,
      created_user_id: userInfo.created_user_id ? userInfo.created_user_id : 0
    }
    return this.http.put<any>('http://localhost:4200/api/user/'+userId, body, { headers });
  }

  updateUserType(userId: any, type:number): Observable<any> {
    const headers = Headers;
    const body = {
      type: type,
      verified_at: true,
    }
    return this.http.put<any>('http://localhost:4200/api/user/'+userId, body, { headers });
  }

  deleteUser(userId: any): Observable<any> {
    const headers = Headers;
    return this.http.delete<any>('http://localhost:4200/api/user/'+userId, { headers });
  }


  verifyAndRegisterUser(userInfo: any, verificationCode: number): Observable<any> {
    const headers = Headers;
    const body = {
      name: userInfo.username,
      email: userInfo.email,
      password: userInfo.password,
      address: userInfo.address,
      phone: userInfo.phone,
      type: 2,
      created_user_id: userInfo.created_user_id ? userInfo.created_user_id : 0,
      confirm_code: verificationCode
    }
    return this.http.post<any>('http://localhost:4200/api/user/verify', body, { headers });
  }
  sendEmail(userInfo: any): Observable<any> {
    const headers = Headers;
    const body = {
      name: userInfo.username,
      email: userInfo.email,
      password: userInfo.password,
      address: userInfo.address,
      phone: userInfo.phone,
      type: 2,
      created_user_id: userInfo.created_user_id ? userInfo.created_user_id : 0
    }
    return this.http.post<any>('http://localhost:4200/api/user/send_email', body, { headers });
  }

  sendEmailForgetPw(userInfo: any): Observable<any> {
    const headers = Headers;
    const body = {
      email: userInfo.email,
      password: userInfo.password,
    }
    return this.http.post<any>('http://localhost:4200/api/user/send_email_forget_pw', body, { headers });
  }

  verifyAndChangePw(userInfo: any, verificationCode: number): Observable<any> {
    const headers = Headers;
    const body = {
      email: userInfo.email,
      password: userInfo.password,
      confirm_code: verificationCode
    }
    return this.http.post<any>('http://localhost:4200/api/user/verify_forget_pw', body, { headers });
  }
}

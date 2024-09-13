import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Headers } from '../httpCommon.service';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  createTransaction(transacData: any): Observable<any> {
    const headers = Headers;
    const userData:any = localStorage.getItem('user');
    const userObject = JSON.parse(userData);
    const body = {
      phone: transacData.phone,
      acc_name: transacData.accName,
      transaction_id: transacData.transactionId,
      pay_amount: transacData.payAmount,
      user_id: userObject.id
    };
    return this.http.post<any>('http://localhost:4200/api/user/transaction', body, { headers });
  }
}

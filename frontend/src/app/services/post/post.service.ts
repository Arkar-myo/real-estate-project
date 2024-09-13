import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Headers } from '../httpCommon.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }
  createPost(postData: any): Observable<any> {
    const headers = Headers;
    const userData:any = localStorage.getItem('user');
    const userObject = JSON.parse(userData);
    const body = {
      title: postData.title,
      description: postData.description,
      price: postData.price,
      soldOut: false,
      gran: postData.gran,
      img: postData.img,
      city: postData.city,
      location: postData.location,
      phone: postData.phone,
      verified: postData.verified,
      created_user_id: userObject.id
    };
    return this.http.post<any>('http://localhost:4200/api/post', body, { headers });
  }

  updatePost(postData: any, postId: number): Observable<any> {
    const headers = Headers;
    const userData:any = localStorage.getItem('user');
    const userObject = JSON.parse(userData);
    const body = {
      title: postData.title,
      description: postData.description,
      price: postData.price,
      soldOut: postData.soldOut,
      gran: postData.gran,
      img: postData.img,
      city: postData.city,
      location: postData.location,
      phone: postData.phone,
      verified: postData.verified,
      created_user_id: userObject.id
    };
    return this.http.put<any>('http://localhost:4200/api/post/'+ postId, body, { headers });
  }

  deletePost(postId: number): Observable<any> {
    const headers = Headers;
    return this.http.delete<any>('http://localhost:4200/api/post/'+ postId, { headers })
  }

  searchPost(searchData: any): Observable<any> {
    const headers = Headers;
    // const userData:any = localStorage.getItem('user');
    // const userObject = JSON.parse(userData);
    const body = {
      title: searchData.type ? searchData.type: '',
      city: searchData.city ? searchData.city : ''
    };
    return this.http.post<any>('http://localhost:4200/api/post/search', body, { headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getBaseUrl() {
    const local = 'http://localhost:3333';
    const prod = 'https://urlll.xyz';
    return prod;
  }

  getApiCall(apiUrl): Promise<void | object> {
    const token = localStorage.getItem('x-access-token');
    let httpOptions;
    if (token !== null) {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'x-access-token': token
        })
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
    }

    return this.http.get(apiUrl, httpOptions).toPromise().then(res => {
      if (Object(res).token === 'expired') {
        localStorage.clear();
        this.router.navigate(['/redirect/session-expired']);
      }
      return res;
    }).catch(err => {
      return err;
    });
  }

  apiCall(apiUrl, payloadData): Promise<void | object> {
    const token = localStorage.getItem('x-access-token');
    let httpOptions;
    if (token !== null) {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'x-access-token': token
        })
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
    }

    return this.http.post(apiUrl, payloadData, httpOptions).toPromise().then(res => {
      if (Object(res).token && Object(res).token === 'expired') {
        // TODO: open a dialog stating session expired
        this.router.navigate(['/redirect/session-expired']);
      }
      return res;
    }).catch(err => {
      return err;
    });
  }
}

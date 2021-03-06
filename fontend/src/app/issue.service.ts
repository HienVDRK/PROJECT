import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  // ROOT_URI = 'https://myapp-backend-hienvd.herokuapp.com';
  ROOT_URI = 'http://localhost:4000';

  auth: any;
  headers: any;
  constructor(private http: HttpClient) {
    this.auth = JSON.parse(window.localStorage.getItem('auth')) || '';
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.accessToken}`
    })
  }

  getIssues() {
    return this.http.get(`${this.ROOT_URI}/issues`);
  }

  getIssueById(id) {
    return this.http.get(`${this.ROOT_URI}/issues/${id}`);
  }

  addIssues(objIssue) {
    this.auth = JSON.parse(window.localStorage.getItem('auth')) || '';
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.accessToken}`
    })
    return this.http.post(`${this.ROOT_URI}/issues/add`, objIssue, { headers: this.headers });
  }

  updateIssues(id, objIssue) {
    this.auth = JSON.parse(window.localStorage.getItem('auth')) || '';
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.accessToken}`
    })
    return this.http.post(`${this.ROOT_URI}/issues/update/${id}`, objIssue, { headers: this.headers });
  }

  deleteIssue(id) {
    this.auth = JSON.parse(window.localStorage.getItem('auth')) || '';
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.accessToken}`
    })
    return this.http.get(`${this.ROOT_URI}/issues/delete/${id}`, { headers: this.headers });
  }
}

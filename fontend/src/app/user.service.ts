import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // ROOT_URI = 'https://myapp-backend-hienvd.herokuapp.com';
  //ROOT_URI = 'http://localhost:4000';

  auth: any;
  headers: any;
  constructor(private http: HttpClient) {
    this.auth = JSON.parse(window.localStorage.getItem('auth')) || '';
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.accessToken}`
    })
  }

  signup(email, firstname, lastname, password, role) {
    const account = {
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: password,
      role: role
    }
    return this.http.post(`${this.ROOT_URI}/users/signup`, account);
  }

  resend(email) {
    return this.http.get(`${this.ROOT_URI}/users/resend/${email}`);
  }


  login(email, password) {
    const account = {
      email: email,
      password: password
    }
    return this.http.post(`${this.ROOT_URI}/users/login`, account);
  }

  getUsers() {
    this.auth = JSON.parse(window.localStorage.getItem('auth')) || '';
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.accessToken}`
    })
    return this.http.get(`${this.ROOT_URI}/users`, { headers: this.headers });
  }


  getUserById(id) {
    return this.http.get(`${this.ROOT_URI}/users/${id}`);
  }

  deleteUser(id) {
    this.auth = JSON.parse(window.localStorage.getItem('auth')) || '';
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.accessToken}`
    })
    return this.http.get(`${this.ROOT_URI}/users/delete/${id}`, { headers: this.headers });
  }

  updateUser(id, objUser){
    this.auth = JSON.parse(window.localStorage.getItem('auth')) || '';
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.accessToken}`
    })
    return this.http.post(`${this.ROOT_URI}/users/update/${id}`, objUser, { headers: this.headers });
  }
}

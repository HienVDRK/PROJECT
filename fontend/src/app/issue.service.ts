import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  ROOT_URI = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getIssues() {
    return this.http.get(`${this.ROOT_URI}/issues`);
  }
  getIssueById(id) {
    return this.http.get(`${this.ROOT_URI}/issues/${id}`);
  }

  addIssues(title, responsible, description, severity) {
    const issue = {
      title: title,
      responsible: responsible,
      description: description,
      severity: severity
    };
    return this.http.post(`${this.ROOT_URI}/issues/add`, issue);
  }

  updateIssues(id, title, responsible, description, severity, status) {
    const issue = {
      title: title,
      responsible: responsible,
      description: description,
      severity: severity,
      status: status
    };
    return this.http.post(`${this.ROOT_URI}/issues/update/${id}`, issue);
  }

  deleteIssue(id) {
    return this.http.get(`${this.ROOT_URI}/issues/delete/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  ROOT_URI = '';

  constructor(private http: HttpClient) { }

  getIssues() {
    // return this.http.get(`${this.ROOT_URI}/issues`);
    return [
      {
        id: 123,
        title: "My first issue",
        responsible: "responsible",
        description: "description",
        severity: "severity",
        status: "Open",
      }
    ]
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListComponent } from './components/list/list.component';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';

import { HttpClientModule } from '@angular/common/http';
import {
  MatToolbarModule, MatFormFieldModule,
  MatInputModule, MatOptionModule, MatSelectModule,
  MatIconModule, MatButtonModule, MatCardModule,
  MatTableModule, MatDividerModule, MatSnackBarModule, MatSidenavModule
} from '@angular/material';
import { IssueService } from './issue.service';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ListUserComponent } from './components/list-user/list-user.component';
import { SignupComponent } from './components/signup/signup.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ResendComponent } from './components/resend/resend.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    CreateComponent,
    EditComponent,
    LoginComponent,
    PageNotFoundComponent,
    ListUserComponent,
    SignupComponent,
    EditUserComponent,
    ResendComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    MatSidenavModule
  ],
  providers: [IssueService],
  bootstrap: [AppComponent]
})
export class AppModule { }

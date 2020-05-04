import { ResendComponent } from './components/resend/resend.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { SignupComponent } from './components/signup/signup.component';
import { ListUserComponent } from './components/list-user/list-user.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { CreateComponent } from './components/create/create.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'create', component: CreateComponent  },
  { path: 'edit/:id', component: EditComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: 'resend', component: ResendComponent},
  { path: 'list-user', component: ListUserComponent},
  { path: 'edit-user/:id', component: EditUserComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

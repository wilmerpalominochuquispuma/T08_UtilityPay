import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ServiciosListComponent } from './Utility/servicios/servicios-list/servicios-list.component';
import { LandingPageComponent } from './Landing_page/landing-page/landing-page.component';
import { UserPanelComponent } from './user/user-panel/user-panel.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'servicios', component: ServiciosListComponent },
  { path: 'landing', component: LandingPageComponent },
  { path: 'dashboard', component: UserPanelComponent },
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: '**', redirectTo: '/landing' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

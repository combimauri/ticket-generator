import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SpinnerLoaderModule } from '../shared/components/spinner-loader/spinner-loader.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, FormsModule, LoginRoutingModule, SpinnerLoaderModule]
})
export class LoginModule {}

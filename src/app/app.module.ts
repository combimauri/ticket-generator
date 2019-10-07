import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { ModalModule } from './shared/directives/modal/modal.module';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, AppRoutingModule, LayoutModule, ModalModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

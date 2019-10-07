import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { ModalDirective } from './shared/directives/modal/modal.directive';

@Component({
  selector: 'tg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('updateModal', { static: true })
  updateModal: ModalDirective;

  constructor(private updateService: SwUpdate) {}

  ngAfterViewInit(): void {
    this.updateService.available.subscribe(event => {
      console.log('Current version is', event.current);
      console.log('Available version is', event.available);
      this.updateModal.modalInstance.open();
    });
    this.updateService.activated.subscribe(event => {
      console.log('Old version was', event.previous);
      console.log('New version is', event.current);
    });
  }

  updateApp(): void {
    window.location.reload();
  }
}

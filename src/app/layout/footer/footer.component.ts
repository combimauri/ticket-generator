import { Component } from '@angular/core';

@Component({
  selector: 'tg-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  footerLink = 'https://github.com/mauricioarce/ticket-generator';
}

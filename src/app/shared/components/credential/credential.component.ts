import {
  Component,
  OnChanges,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';

import { QRCodeComponent } from 'angularx-qrcode';

import { Assistant } from '../../models/assistant.model';

@Component({
  selector: 'tg-credential',
  templateUrl: './credential.component.html',
  styleUrls: ['./credential.component.scss']
})
export class CredentialComponent implements OnChanges {
  qrData = 'QR was not generated yet';
  @Input() canvasWidth: number;
  @Input() canvasHeight: number;
  @Input() assistant: Assistant;
  @ViewChild('credentialCanvas', { static: true })
  credentialCanvas: ElementRef;
  @ViewChild('qrCode', { static: true })
  private qrCode: QRCodeComponent;

  ngOnChanges(): void {
    this.loadCredential();
  }

  print(): void {
    const printButton = document.createElement('a');
    printButton.download = this.assistant.fullName;
    printButton.href = this.credentialCanvas.nativeElement.toDataURL(
      'image/png;base64'
    );

    printButton.click();
  }

  private loadCredential(): void {
    if (this.assistant) {
      this.qrData = this.assistant.id;
      const context = (this.credentialCanvas
        .nativeElement as HTMLCanvasElement).getContext('2d');
      const templateImage = new Image();
      const qrTop = 50;
      const qrLeft = 50;
      const nameTop = 360;
      const textLeft = this.canvasWidth / 2;

      templateImage.src = 'assets/images/template-women-day.jpg';
      templateImage.onload = () => {
        let qrImage = this.qrCode.el.nativeElement.querySelector('img');

        if (!qrImage.src) {
          qrImage = this.qrCode.el.nativeElement.querySelector('canvas');
        }

        context.drawImage(templateImage, 0, 0);
        context.font = '20px Raleway';
        context.fillStyle = '#000000';
        context.textAlign = 'center';
        context.fillText(this.assistant.fullName, textLeft, nameTop);
        context.drawImage(qrImage, qrLeft, qrTop, 255, 255);
      };
    }
  }
}

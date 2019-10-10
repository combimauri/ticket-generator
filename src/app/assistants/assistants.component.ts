import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { MaterializeService } from '../shared/services/materialize/materialize.service';
import { CredentialComponent } from '../shared/components/credential/credential.component';
import { AssistantService } from '../shared/services/assistant/assistant.service';
import { Assistant } from '../shared/models/assistant.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'tg-assistants',
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.scss']
})
export class AssistantsComponent implements OnInit, OnDestroy {
  readonly emptyAssistant: Assistant = {
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    deleteFlag: false
  };
  searchTerm = '';
  assistants: Assistant[];
  assistantsSubscription: Subscription;
  selectedAssistant: Assistant;
  assistantsForm: FormGroup;
  loading: boolean;
  @ViewChild('credential', { static: false })
  currentCredential: CredentialComponent;

  constructor(
    public assistantService: AssistantService,
    private materialService: MaterializeService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.assistantsForm = this.formBuilder.group({ ...this.emptyAssistant });
    this.assistantsSubscription = this.assistantService
      .getAssistants()
      .subscribe(assistants => {
        this.assistants = assistants;
        this.searchAssistant();
      });
  }

  ngOnDestroy(): void {
    if (this.assistantsSubscription) {
      this.assistantsSubscription.unsubscribe();
    }
  }

  searchAssistant(): void {
    if (this.searchTerm) {
      this.assistants.forEach(assistant => {
        assistant.visibleInSearch = assistant.fullName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase());
      });
    } else {
      this.assistants.forEach(assistant => {
        assistant.visibleInSearch = true;
      });
    }
  }

  upsertAssistant(): void {
    this.assistantService
      .upsertAssistant(this.assistantsForm.value)
      .then(() => this.patchAssistantsForm(this.emptyAssistant));
  }

  patchAssistantsForm(assistant: Assistant): void {
    this.assistantsForm.patchValue({ ...assistant });
    this.materialService.updateTextFields();
  }

  printCredential(): void {
    if (this.currentCredential) {
      this.currentCredential.print();
    }
  }

  sendCredentialByWhatsApp(assistant?: Assistant): void {
    this.selectedAssistant = assistant ? assistant : this.selectedAssistant;

    this.buildCredentialForSelectedAssistantAndSendIt();
  }

  toggleQRSent(assistant: Assistant): void {
    assistant.qrSent = !assistant.qrSent;

    this.assistantService.upsertAssistant(assistant);
  }

  private buildCredentialForSelectedAssistantAndSendIt(): void {
    this.loading = true;

    if (this.selectedAssistant) {
      if (this.currentCredential) {
        this.assistantService
          .getAssistantCredentialUrl(this.selectedAssistant)
          .subscribe(
            (url: string) => {
              console.log('Assistant:', this.selectedAssistant.fullName);
              console.log('Credential url:', url);

              url = url.replace('&', '%26');
              url = url.replace('%2F', '%252F');
              url = `${this.buildWhatsAppLinkForSelectedAssistant()} ${url}`;
              this.loading = false;

              window.open(url, '_blank', 'noopener,noreferrer');
            },
            () => {
              this.currentCredential.credentialCanvas.nativeElement.toBlob(
                (file: Blob) => {
                  this.assistantService
                    .uploadAssistantCredential(this.selectedAssistant, file)
                    .snapshotChanges()
                    .pipe(
                      finalize(() => {
                        this.buildCredentialForSelectedAssistantAndSendIt();
                      })
                    )
                    .subscribe();
                },
                'image/png',
                1
              );
            }
          );
      } else {
        setTimeout(() => {
          this.buildCredentialForSelectedAssistantAndSendIt();
        }, 100);
      }
    } else {
      this.loading = false;
      alert('You did not select any assistant');
    }
  }

  private buildWhatsAppLinkForSelectedAssistant(): string {
    const name = this.selectedAssistant.firstName
      ? this.selectedAssistant.firstName
      : this.selectedAssistant.fullName;
    const phone = this.selectedAssistant.phoneNumber.trim();

    // tslint:disable-next-line: max-line-length
    return `https://wa.me/591${phone}?text=¡Hola ${name}! Soy parte de la organización del evento de tecnología por el Día Nacional de la Mujer. Necesitarás el código QR del enlace que te estoy mandando para poder registrarte ese día en el evento ¡Gracias por formar parte! Nos vemos ahí :D`;
  }
}

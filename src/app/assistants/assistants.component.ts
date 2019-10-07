import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { MaterializeService } from '../shared/services/materialize/materialize.service';
import { CredentialComponent } from '../shared/components/credential/credential.component';
import { AssistantService } from '../shared/services/assistant/assistant.service';
import { Assistant } from '../shared/models/assistant.model';

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
}

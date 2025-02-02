import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

@NgModule({
  exports: [
    ButtonModule,
    MenubarModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    TableModule,
    ToastModule,
    MessageModule,
    CardModule,
    BreadcrumbModule,
    InputTextModule,
    PanelModule,
    TabViewModule,
    DialogModule,
    DynamicDialogModule,
    InputTextareaModule,
    DropdownModule,
    InputSwitchModule,
    FileUploadModule
  ],
  providers: [
    MessageService
  ]
})
export class PrimengModule {
}

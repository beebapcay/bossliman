import { Injectable } from '@angular/core';
import { ApplicationModel } from '../models/application.model';
import { LicenseModel } from '../models/license.model';
import { ProviderService } from './provider.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(public providerService: ProviderService,
              public snackbarService: SnackbarService) {
  }

  public async createLicense(application: ApplicationModel, license: LicenseModel) {
    try {
      await application.createLicense(license);
      this.snackbarService.openSuccessAnnouncement(`Create License Success: ${license.address}`)
    } catch (error) {
      this.snackbarService.openRequestErrorAnnouncement(error);
    }
  }

  public async updateLicense(license: LicenseModel) {
    try {
      await license.update();
      this.snackbarService.openSuccessAnnouncement(`Update License Success: ${license.address}`);
    } catch (error) {
      this.snackbarService.openRequestErrorAnnouncement(error);
    }
  }
}

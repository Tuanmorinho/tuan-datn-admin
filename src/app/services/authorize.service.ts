import { Injectable } from '@angular/core';
import { AlertFlashService } from '@app/services/alert-flash.service';

@Injectable({ providedIn: 'root' })
export class AuthorizeService {
    constructor(private alertFlashService: AlertFlashService) { }


    isAuthorizedToAccessThis(res) {
        if (res.status === 403) {
            this.alertFlashService.warn([res?.error?.detail || 'Bạn không có quyền vào đây'], {
                autoClose: true,
                keepAfterRouteChange: true
            });
            return;
        } else {
            this.alertFlashService.error(res, {
                autoClose: true,
                keepAfterRouteChange: true
            });
        }
    }
}
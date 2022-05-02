import {HttpException} from './../interfaces/exception.interface';
import {DialogService} from './dialog.service';
import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';
import {LocalStorageService} from './storage.service';
import { environment } from 'environments/environment';

export class UnauthenticatedException implements HttpException {
    code = '401';
    message = 'Unauthenticated';
}

@Injectable()
export class HttpErrorHandler {

    /**
     * HttpErrorHandler Constructor.
     */
    constructor(
        private router: Router,
        private storageService: LocalStorageService,
        private dialogService: DialogService
    ) {
    }

    /**
     * Handle http request error.
     */
    public handle(response: HttpErrorResponse) {
        const body = this.parseJson(response.error);
        const authLocalStorgeUser = `user-${environment.appVersion}`
        const authLocalStorageToken = `app_access_token`
        if (response.status === 401) {
            localStorage.removeItem(authLocalStorageToken);
            localStorage.removeItem(authLocalStorgeUser);
            window.location.href = environment.domain + '/auth/login';
        }

        if (response.status === 403) {
            // this.dialogService.warning(this.translateService.translate('message.no_permission'));
            const message = 'No permission';
            this.dialogService.warning(message);
        }

        if (response.status === 404) {
            // const { protocol, hostname, port} = window.location;
            // window.location.href = protocol + '//' + hostname + (port ? ':'+port : '' ) + '/404';
            const message = 'Api 404';
            this.dialogService.warning(message);
            // localStorage.removeItem(authLocalStorageToken);
            // localStorage.removeItem(authLocalStorgeUser);
            // window.location.href = environment.domain + '/auth/login';
        }

        if (body) {
            // const message = body.message || this.translateService.translate('message.unknow_error');
            const message = body.message || 'unknow error';
            this.dialogService.warning(message);
        }

        return throwError(response);
    }

    /**
     * Parse JSON without throwing errors.
     */
    private parseJson(json: string): { message?: string } {
        if (typeof json !== 'string') {
            return json;
        }

        try {
            return JSON.parse(json);
        } catch (e) {
            return {};
        }
    }
}

import { ChangeDetectorRef, Injectable } from '@angular/core';
import { AlertFlashModel, AlertFlashType } from '@app/modules/core/_alert/alert-flash.model';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AlertFlashService {

  private subject = new Subject<AlertFlashModel>();
  private defaultId = 'default-alert';

  // enable subscribing to alerts observable
  onAlert(id = this.defaultId): Observable<AlertFlashModel> {
    return this.subject.asObservable().pipe(filter(x => x && x.id === id));
  }

  // convenience methods
  success(message: string[], options?: any) {
    this.alert(new AlertFlashModel({ ...options, type: AlertFlashType.Success, message }));
  }

  error(arrayErrors: any, options?: any) {
    let message = [];
    if (arrayErrors.error.status == 400) {
      const errors = arrayErrors.error.errors;
      if (errors !== null && errors !== undefined) {
        Object.keys(errors).forEach((key) => {
          for (let i = 0; i < errors[key].length; i++) {
            message.push(errors[key][i]);
          }
        });
      }
      if (message.length === 0) {
        if (arrayErrors.error.detail) {
          message.push(arrayErrors.error.detail);
        } else {
          message.push('Có lỗi xảy ra');
        }        
      }
    } else {
      message.push(arrayErrors.error.error);
      message.push(arrayErrors.error.errorMessage);
      message.push(arrayErrors.error.message);
    }
    if (arrayErrors.isArray) {
      this.alert(new AlertFlashModel({ ...options, type: AlertFlashType.Error, message: arrayErrors }));
    } else {
      this.alert(new AlertFlashModel({ ...options, type: AlertFlashType.Error, message: message }));
    }
  }

  info(message: [string], options?: any) {
    this.alert(new AlertFlashModel({ ...options, type: AlertFlashType.Info, message }));
  }

  warn(message: [string], options?: any) {
    this.alert(new AlertFlashModel({ ...options, type: AlertFlashType.Warning, message }));
  }

  manualError(message: [string], options?: any) {
    this.alert(new AlertFlashModel({ ...options, type: AlertFlashType.Error, message }));
  }

  // main alert method
  alert(alert: AlertFlashModel) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
    window.scrollTo(0, 0);
  }


  // clear alerts
  clear(id = this.defaultId) {
    this.subject.next(new AlertFlashModel({ id }));
  }
}

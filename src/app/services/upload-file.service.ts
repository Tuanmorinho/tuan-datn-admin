import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UploadFileRepository } from '@app/repositories/upload-file.repository';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, mergeMap, timeout } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UploadFileService {
    constructor(private repository: UploadFileRepository) { }

    private _isSubmit$ = new Subject();
    private _clearFiles$ = new Subject();

    postFile(file: File): Observable<any> {
        if (file)
            return this.repository.postFile(file)
        else
            return of({});
    }

    get isSubmit$() {
        return this._isSubmit$.asObservable();
    }

    isSubmit() {
        this._isSubmit$.next();
    }

    get clearFiles$() {
        return this._clearFiles$.asObservable();
    }

    clearFile() {
        this._clearFiles$.next();
    }

    downloadFile(bucket: string, fileName: string): Observable<any> {
        return this.repository.download(bucket, fileName).pipe(
            mergeMap((res:any)=>{
                const result = new BehaviorSubject<string>('');
                const reader = new FileReader();
                reader.readAsDataURL(res.body);
                reader.onload = () => result.next(reader.result.toString());                
                return result;
            })
        );
    }

    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            return new Promise((res, _) => {
                res(reader.result);
            });
        }, false);
        if (image) {
           reader.readAsDataURL(image);
        }
     }

    httpUploadProgress(events) {
        if (events.type === HttpEventType.Response) {
            return 100;
        }
        if (events.type === HttpEventType.UploadProgress) {
            return Math.round(100 * events.loaded / events.total);
        }
    }

    uploadFile(file: any = null) {
        if (file instanceof File) {
            return new Promise((res, rej) => {
                this.postFile(file).subscribe(v => {
                    if (v.body) {
                        this.clearFile();
                        res(v.body);
                    }
                }, error => {
                    rej(error);
                });
            })
        } else if (file instanceof Object) {
            return new Promise((res, _) => {
                res(file);
            });
        } else {
            return new Promise((res, _) => {
                res(null);
            });
        }
    }

    normalizedFileTypes(types) {
        if (typeof types !== 'string') return null;
        let words = types.split('.');
        return words[words.length - 1];
    }
}
import { HttpClient, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UploadFileRepository {
    constructor(
        protected http: HttpClient,
    ) {}

    postFile(file: File): Observable<HttpEvent<any>> {
        const API_URL = environment.apiUrl + '/storage';
        const formData: any = new FormData();
        formData.append('file', file);

        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('app_access_token'));
        return this.http.post(`${API_URL}`, formData, {
            reportProgress: true,
            observe:'events',
            headers
        });
    }

    download(bucket: string, fileName: string) {
        const API_URL = environment.apiUrl + '/storage';
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', 'Bearer ' + localStorage.getItem('app_access_token'));
        return this.http.get(`${API_URL}/${bucket}/${fileName}`, { observe: 'response', responseType: 'blob' as 'json', headers })
    }
}
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { DialogService } from "@services/dialog.service";
import { LoaderService } from "@services/loader.service";
import { LocalStorageService } from "@services/storage.service";
import { AlertFlashService } from "./alert-flash.service";
import { SubheaderService } from "@app/_metronic/partials/layout";
import { AuthorizeService } from "@app/services/authorize.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "@app/modules/auth";
import { UsersService } from "./users.service";
import { HttpClient } from "@angular/common/http";
@Injectable({
    providedIn: 'root',
})
export class ComponentService {
    constructor(
        public router: Router,
        public localStorage: LocalStorageService,
        public loader: LoaderService,
        public dialog: DialogService,
        public location: Location,
        public alertFlashService: AlertFlashService,
        public subheaderService: SubheaderService,
        public authorizeService: AuthorizeService,
        public modalService: NgbModal,
        public authService: AuthService,
        public usersService: UsersService,
        public httpClient: HttpClient,
    ) {
    }    
}
import { ChangeDetectorRef, Component } from '@angular/core';
import { UploadFileService } from '@app/services/upload-file.service';
import { UsersService } from '@app/services/users.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService, UserModel } from '../../../auth';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  user$: Observable<UserModel>;

  imageUrl: any = "./assets/media/svg/icons/Common/Group.svg";
  constructor(
    public authService: AuthService,
    private usersService: UsersService,
    private ref: ChangeDetectorRef,
    protected uploadFileService: UploadFileService
    ) {

    this.usersService.getUserById(this.authService.currentUserValue.sub).subscribe((res: any) => {
      this.user$ = of(res);
      const bucket = res.attributes?.photo_bucket ? res.attributes?.photo_bucket[0] : '';
      const fileName = res.attributes?.photo_key ? res.attributes?.photo_key[0] : '';
      this.uploadFileService.downloadFile(bucket, fileName).subscribe(v => {
        if (v) {
          this.imageUrl = v;
          this.ref.detectChanges();
        }
      })
      this.ref.detectChanges();
    }, catchError(err => {
      this.user$ = this.authService.currentUserSubject.asObservable();
      return err;
    }));
  }
}

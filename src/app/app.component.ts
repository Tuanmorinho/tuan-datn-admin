import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslationService } from './modules/i18n/translation.service';
// language list
import { SplashScreenService } from './_metronic/partials/layout/splash-screen/splash-screen.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { TableExtendedService } from './_metronic/shared/crud-table';
import { UsersService } from './services/users.service';
import { encryptUsingAES256 } from './modules/core/utils/helpers';
import { ResponseModel } from './modules/core/model/response-model';
import { environment } from 'environments/environment';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private splashScreenService: SplashScreenService,
    private router: Router,
    private tableService: TableExtendedService,
    private userService: UsersService
  ) {}

  ngOnInit() {
    
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {   
        const authLocalStorgeUser = `user-${environment.appVersion}`     
        // clear filtration paginations and others
        this.tableService.setDefaults();
        // hide splash screen
        this.splashScreenService.hide();

        // if (localStorage.getItem('app_access_token')) {
        //   this.userService.getCurrentUser().subscribe((v: ResponseModel) => {
        //     let user = v.data.currentUser;
        //     user.userRole = encryptUsingAES256(user.userRole);
        //     user.currentId = encryptUsingAES256(user.id);
        //     localStorage.setItem(authLocalStorgeUser, JSON.stringify(user))
        //   });
        // }
        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 500);
      }
    });
    this.unsubscribe.push(routerSubscription);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

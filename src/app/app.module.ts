import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/_services/auth.service';
// Highlight JS
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
import { BaseComponent } from '@app/modules/core/base/base.component';
import { AppHttpClient } from '@app/services/app-http.client.service';
import { HttpErrorHandler } from '@app/services/http-error-handler.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
registerLocaleData(localeVi);;

function appInitializer(authService: AuthService) {
  return () => authService.getUserByToken();
}


@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SplashScreenModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    HighlightModule,
    ClipboardModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    FlashMessagesModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    { provide: LOCALE_ID, useValue: "vi-VI" },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
          json: () => import('highlight.js/lib/languages/json')
        },
      },
    },
    AppHttpClient,
    HttpErrorHandler,
    DecimalPipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

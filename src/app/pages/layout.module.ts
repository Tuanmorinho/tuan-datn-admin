import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { PagesRoutingModule } from './pages-routing.module';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from '../modules/i18n/translation.module';
import { LayoutComponent } from './_layout/layout.component';
import { ScriptsInitComponent } from './_layout/init/scipts-init/scripts-init.component';
import { HeaderMobileComponent } from './_layout/components/header-mobile/header-mobile.component';
import { AsideComponent } from './_layout/components/aside/aside.component';
import { FooterComponent } from './_layout/components/footer/footer.component';
import { HeaderComponent } from './_layout/components/header/header.component';
import { HeaderMenuComponent } from './_layout/components/header/header-menu/header-menu.component';
import { TopbarComponent } from './_layout/components/topbar/topbar.component';
import { ExtrasModule } from '../_metronic/partials/layout/extras/extras.module';
import { LanguageSelectorComponent } from './_layout/components/topbar/language-selector/language-selector.component';
import { CoreModule } from '../_metronic/core';
import { SubheaderModule } from '../_metronic/partials/layout/subheader/subheader.module';
import { AsideDynamicComponent } from './_layout/components/aside-dynamic/aside-dynamic.component';
import { HeaderMenuDynamicComponent } from './_layout/components/header/header-menu-dynamic/header-menu-dynamic.component';
import { AlertFlashModule } from '@app/modules/core/_alert/alert-flash.module';
import { DirectivesModule } from '@app/modules/core/directives/directives.module';
import { FontSizeComponent } from '@app/pages/_layout/init/scipts-init/font-size/font-size.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MenuActiveDirective } from '@app/pages/_layout/components/aside/directive/select-menu.directive';
import {LayoutPageComponent} from '@app/pages/_layout-page/layout-page.component';
import {HeaderMyPageComponent} from '@app/pages/_layout-page/components/header/header-my-page.component';
import { ReusableComponentsModule } from '@app/modules/core/reusable-components/reusable-components.module';

@NgModule({
  declarations: [
    LayoutComponent,
    LayoutPageComponent,
    ScriptsInitComponent,
    HeaderMobileComponent,
    AsideComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuComponent,
    TopbarComponent,
    LanguageSelectorComponent,
    AsideDynamicComponent,
    HeaderMenuDynamicComponent,
    FontSizeComponent,
    MenuActiveDirective,
    HeaderMyPageComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    TranslationModule,
    InlineSVGModule,
    ExtrasModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    CoreModule,
    SubheaderModule,
    AlertFlashModule,
    DirectivesModule,
    MatTooltipModule,
    ReusableComponentsModule
  ],
})
export class LayoutModule { }

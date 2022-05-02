import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResolveEnd, Router } from '@angular/router';
import { AuthService } from '@app/modules/auth';
import { MenuCategories, Permissions, PrimaryAside, SettingAside } from '@app/pages/_layout/components/aside/primay-aside';
import { StyleService } from '@app/services/style.service';
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../../_metronic/core';
import { Menu } from './menu';

@Component({
  selector: "app-aside",
  templateUrl: "./aside.component.html",
  styleUrls: ["./aside.component.scss"],
})
export class AsideComponent implements OnInit, OnChanges {
  disableAsideSelfDisplay: boolean = false;
  headerLogo: string;
  brandSkin: string;
  ulCSSClasses: string;
  asideMenuHTMLAttributes: any = {};
  asideMenuCSSClasses: string;
  asideMenuDropdown;
  brandClasses: string;
  asideMenuScroll = 1;
  asideSelfMinimizeToggle = false;
  currentUrl: string = window.location.pathname?.split("/")[1];
  extDocumentsData = [];
  private unsubscribe: Subscription[] = [];
  primaryMenu = PrimaryAside;
  setMenu = SettingAside;
  menus = Menu;
  primaryMenuName = Menu[0].name;
  arrMenu = [];

  constructor(
    private layout: LayoutService,
    private router: Router,
    public ref: ChangeDetectorRef,
    private styleService: StyleService,
    private authService: AuthService
  ) {}

  ngOnChanges() {}

  ngOnInit(): void {
    // load view settings
    this.disableAsideSelfDisplay =
      this.layout.getProp("aside.self.display") === false;
    this.brandSkin = this.layout.getProp("brand.self.theme");
    this.headerLogo = this.getLogo();
    this.ulCSSClasses = this.layout.getProp("aside_menu_nav");
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses("aside_menu");
    this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes("aside_menu");
    this.asideMenuDropdown = this.layout.getProp("aside.menu.dropdown")
      ? "1"
      : "0";
    this.brandClasses = this.layout.getProp("brand");
    this.asideSelfMinimizeToggle = this.layout.getProp(
      "aside.self.minimize.toggle"
    );
    this.asideMenuScroll = this.layout.getProp("aside.menu.scroll") ? 1 : 0;
    this.asideMenuCSSClasses = `${this.asideMenuCSSClasses} ${
      this.asideMenuScroll === 1 ? "scroll my-4 ps ps--active-y" : ""
    }`;

    const roles = this.getAvailableRoles();
    this.primaryMenu = this.primaryMenu.filter(v => {
      return roles.filter(v2 => v.roles?.indexOf(v2) != -1).length
    });

    // First Reload page
    this.currentUrl = window.location.href.split("/")
      ? window.location.href.split("/")[3]
      : null;
    for (let menu of Menu) {
      if (menu.routers.includes(this.currentUrl)) {
        this.changeCategory(menu.name);
        break;
      }
    }

    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof ResolveEnd) {
        this.currentUrl = event.url.split("/") ? event.url.split("/")[1] : null;
        for (let menu of Menu) {
          if (menu.routers.includes(this.currentUrl)) {
            this.changeCategory(menu.name);
            break;
          }
        }
      }
    });

    this.unsubscribe.push(routerSubscription);
  }

  getAvailableRoles() {
    const user = this.authService.currentUserValue;
    let availableRoles = [Permissions.viewDefault];
    if (user) {
      if (
        user?.resource_access['realm-management']
      ) {
        availableRoles.push(Permissions.manageUsers);
      }      
    }
    return availableRoles;
  }

  isMenuItemActive(path) {
    return true;
  }

  private getLogo() {
    if (this.brandSkin === "light") {
      return "./assets/media/logos/LOGO_BFMS.png";
    } else {
      return "./assets/media/logos/logo.png";
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  changeCategory(name, url = "") {
    // if (name === MenuCategories.DASHBOARD) {
    //   this.router.navigate([url]);
    // }

    // (this.menus as any).length = 0;
    // (this.menus as any) = [];
    // const roles = this.getAvailableRoles();
    // this.menus = Menu.find((menu) => menu.name === name);
    // this.menus.subMenus = Menu.find(menu => menu.name === name)?.subMenus.filter(v => {
    //   return v.roles ? roles.filter(v2 => v.roles?.indexOf(v2) != -1).length : true;
    // });
    // if (this.primaryMenuName !== name)
    //   document.getElementById("kt_aside_menu").scrollTo(0, 0);

    // this.primaryMenuName = name;

    // this.styleService.removeClassName("kt_body", "aside-minimize");
  }
}

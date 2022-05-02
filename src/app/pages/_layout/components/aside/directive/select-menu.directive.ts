import { DOCUMENT } from "@angular/common";
import { Directive, OnInit, Renderer2, Input, ElementRef, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Directive({
    selector: "[menuActive]"
})
export class MenuActiveDirective implements OnInit {
    @Input("menuActive") menuActive: any;
    readonly subscription = new Subscription();

    constructor(
        private renderer: Renderer2,
        private router: Router,
        private el: ElementRef,
        @Inject(DOCUMENT) private readonly documentRef: Document) {


    }

    ngOnInit(): void {
        const routerSubscription = this.router.events.subscribe((event: any) => {
            let currentUrl = event.url?.split('/') ? event.url.split('/')[1] : null;
            if (this.menuActive?.indexOf(currentUrl) > -1) {
                let parentMenu = this.el.nativeElement.parentNode.closest('li');
                if (!parentMenu.classList.contains('menu-item-open')) parentMenu.classList.add('menu-item-open');
                this.renderer.setAttribute(this.el.nativeElement, 'class', 'menu-item menu-item-active menu-item-submenu')
            }
        })
        this.subscription.add(routerSubscription);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}

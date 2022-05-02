import { ComponentFactoryResolver, Directive, Input, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[customCell]' })
export class CustomCellDirective {
    @Input() component: any;
    @Input() prop: any;
    @Input() dataKey: string;
    @Input() isModal: any;
    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef) {
    }

    componentRef: any;

    ngOnInit() {
        const factory = this.resolver.resolveComponentFactory(this.component);

        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.prop = this.prop;
        this.componentRef.instance.isModal = this.isModal;
        this.componentRef.instance.dataKey = this.dataKey;
        // let element: HTMLElement = <HTMLElement>this.componentRef.location.nativeElement;
    }

    destroyComponent() {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }

    ngOnDestroy(): void {
        this.destroyComponent()
    }

}
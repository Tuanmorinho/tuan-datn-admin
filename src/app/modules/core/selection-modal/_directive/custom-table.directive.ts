import { ComponentFactoryResolver, Directive, Input, Output, SimpleChanges, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[customTable]' })
export class CustomTableDirective {
    @Input() component: any;
    @Input() filter: any;
    @Input() ids: number[];
    @Input() isSelectedOnlyItem: boolean = false;
    @Input() hasScrollbarX: boolean = false;

    constructor(        
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef) {
    }

    componentRef : any;

    ngOnInit(){
        // const factory = this.resolver.resolveComponentFactory(this.component);
        // this.componentRef = this.container.createComponent(factory);
        // this.componentRef.instance.isModal = true;
        // this.componentRef.instance.filter = this.filter;
        // this.componentRef.instance.ids = this.ids;
        // this.componentRef.instance.hasScrollbarX = this.hasScrollbarX;
        // this.componentRef.instance.isSelectedOnlyItem = this.isSelectedOnlyItem;
        // // let element: HTMLElement = <HTMLElement>this.componentRef.location.nativeElement;
    }

    ngOnChanges(changes: SimpleChanges){
        if (this.componentRef) {
            this.componentRef.destroy();
        }
        const factory = this.resolver.resolveComponentFactory(this.component);
        this.componentRef = this.container.createComponent(factory);
        this.componentRef.instance.isModal = true;
        this.componentRef.instance.filter = this.filter;
        this.componentRef.instance.ids = this.ids;
        this.componentRef.instance.hasScrollbarX = this.hasScrollbarX;
        this.componentRef.instance.isSelectedOnlyItem = this.isSelectedOnlyItem;
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
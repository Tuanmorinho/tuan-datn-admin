import { Component, OnInit } from '@angular/core';
import { StyleService } from '@app/services/style.service';

@Component({
    selector: 'app-fontSize',
    templateUrl: 'font-size.component.html',
})

export class FontSizeComponent implements OnInit {

    constructor(private styleService: StyleService) { }

    ngOnInit() {
      this.styleService.addStyle('font-small', require('../../../../../../assets/sass/components/_variables_ext_custom.scss').default);
    }
  
    ngOnDestroy() {
      this.styleService.removeStyle('font-small');
    }
  
}
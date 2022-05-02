import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  providers: [NgbCarouselConfig]
})
export class AuthComponent implements OnInit {
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;
  constructor(config: NgbCarouselConfig) { 
    // customize default values of carousels used by this component tree
    config.interval = 6000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit(): void {
  }

  images = [1, 2, 3, 4, 5].map((n) => `../../../assets/login/IMG-${n}.png`);

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

}

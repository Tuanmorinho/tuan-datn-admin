import { formatDate } from "@angular/common";
import { ChangeDetectorRef, Component } from "@angular/core";
import { BaseComponent } from '@app/modules/core/base/base.component';
import { ComponentService } from "@app/services/component.service";
import { ForecastService } from "@app/services/forecast.service";

@Component({
  selector: "weather-info",
  templateUrl: "./weather-info.component.html",
  styleUrls: ["./weather-info.component.scss"],
})
export class WeatherInfoComponent extends BaseComponent {
  weathers = [];
  constructor(
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private forecastService: ForecastService
  ) {
    super(service);
  }

  ngOnInit() {
    if (this.filter)
      this.forecastService.getWeather({
        longitude: this.filter?.coordinate[0],
        latitude: this.filter?.coordinate[1],
        numberOfDays: 7
      }).subscribe((v: any[]) => {
        this.weathers = v.map(v2 => {
          const sunrise = new Date(v2.sunrise);
          const sunset = new Date(v2.sunset);
          return {
            ...v2,
            sunrise: formatDate(sunrise.setHours(sunrise.getHours() + 7), 'dd/MM/yyyy HH:mm', 'vi'),
            sunset: formatDate(sunset.setHours(sunset.getHours() + 7), 'dd/MM/yyyy HH:mm', 'vi')
          }
        });
        this.ref.detectChanges();
      })
  }
}

import { Inject, Injectable } from "@angular/core";
import { TableService } from "@app/_metronic/shared/crud-table";
import { AppHttpClient } from "./app-http.client.service";

@Injectable({
  providedIn: "root",
})
export class ForecastService  extends TableService<any> {
  API_URL = "/analysis/weather/forecast";

  constructor(@Inject(AppHttpClient) http) {
    super(http);
  }

  getWeather(data: any) {
    return this.http.get(this.API_URL, data);
  }
}

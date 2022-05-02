import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BaseComponent } from "@app/modules/core/base/base.component";
import { ComponentService } from "@app/services/component.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-map-land",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapLandComponent extends BaseComponent {
  constructor(
    protected service: ComponentService,
    public ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    super(service);
  }

  async ngOnInit() {

    if (!this.isModal)
      this.service.subheaderService.updateBreadcrumbs(
        [
          {
            title: "Bản đồ số nông nghiệp",
            linkPath: this.router.url,
            linkText: "",
          },
        ],
        "Trang chủ"
    );
  }
}

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import BingMaps from "ol/source/BingMaps";
import TileWMS from "ol/source/TileWMS";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Control from "ol/control/Control";
import { DOCUMENT } from "@angular/common";
import { Group as LayerGroup } from "ol/layer";
import Overlay from "ol/Overlay";
import { getArea, getLength } from "ol/sphere";
import { Circle as CircleStyle } from "ol/style";
import { Draw, Modify } from "ol/interaction";
import { LineString, Point, Polygon } from "ol/geom";
import { Fill, RegularShape, Stroke, Style, Text } from "ol/style";
import { DrawEvent } from "ol/interaction/Draw";
import { WeatherInfoComponent } from "../weather-info/weather-info.component";
import {
  get as getProjection,
} from 'ol/proj';
@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  @ViewChild("mapElement") mapElement: ElementRef;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.map && this.draw) {
      this.map.removeInteraction(this.draw);
    }
  }
  constructor(
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private ref: ChangeDetectorRef
  ) { }

  map: Map;
  weatherComponent: any = WeatherInfoComponent;
  filter: any;
  highlight;
  featureOverlay: any;
  draw: Draw;
  modifyStyle = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new Stroke({
      color: '#ffcc33',
      width: 2,
    }),
    image: new CircleStyle({
      radius: 7,
      fill: new Fill({
        color: '#ffcc33',
      }),
    }),
  });
  source = new VectorSource({ wrapX: false });
  modify = new Modify({ source: this.source });
  tipPoint;
  style = new Style({
    fill: new Fill({
      color: "rgba(255, 255, 0, 0.2)",
    }),
    stroke: new Stroke({
      color: "rgba(0, 0, 0, 0.5)",
      lineDash: [10, 10],
      width: 2,
    }),
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: "rgba(0, 0, 0, 0.7)",
      }),
      fill: new Fill({
        color: "rgba(255, 255, 0, 0.2)",
      }),
    }),
  });

  labelStyle = new Style({
    text: new Text({
      font: "14px Calibri,sans-serif",
      fill: new Fill({
        color: "rgba(255, 255, 0, 1)",
      }),
      backgroundFill: new Fill({
        color: "rgba(0, 0, 0, 0.7)",
      }),
      padding: [3, 3, 3, 3],
      textBaseline: "bottom",
      offsetY: -15,
    }),
    image: new RegularShape({
      radius: 8,
      points: 3,
      angle: Math.PI,
      displacement: [0, 10],
      fill: new Fill({
        color: "rgba(0, 0, 0, 0.7)",
      }),
    }),
  });

  tipStyle = new Style({
    text: new Text({
      font: "12px Calibri,sans-serif",
      fill: new Fill({
        color: "rgba(255, 255, 0, 1)",
      }),
      backgroundFill: new Fill({
        color: "rgba(0, 0, 0, 0.4)",
      }),
      padding: [2, 2, 2, 2],
      textAlign: "left",
      offsetX: 15,
    }),
  });

  segmentStyle = new Style({
    text: new Text({
      font: "12px Calibri,sans-serif",
      fill: new Fill({
        color: "rgba(255, 255, 0, 1)",
      }),
      backgroundFill: new Fill({
        color: "rgba(0, 0, 0, 0.4)",
      }),
      padding: [2, 2, 2, 2],
      textBaseline: "bottom",
      offsetY: -12,
    }),
    image: new RegularShape({
      radius: 6,
      points: 3,
      angle: Math.PI,
      displacement: [0, 8],
      fill: new Fill({
        color: "rgba(0, 0, 0, 0.4)",
      }),
    }),
  });

  segmentStyles = [this.segmentStyle];

  layers = [
    new TileLayer({
      source: new BingMaps({
        key: 'AlWIllLtHCA1n7MVtgT_Vp2VlzhYzkpGPNOtT7UAMmPmHsFO4Vux0CnW_31Ws5Kt',
        imagerySet: 'AerialWithLabelsOnDemand'
      }),
    }),
    new VectorLayer({
      source: this.source,
      style: (feature) => {
        return this.styleFunction(feature, true);
      },
    }),
    new LayerGroup({
      layers: [
        new TileLayer({
          preload: Infinity,
          source: new TileWMS({
            url: "http://bb7a-222-252-28-93.ngrok.io/geoserver/bfms/wms",
            params: {
              LAYERS: "bfms:QuangBi-local",
            },
            serverType: "geoserver",
          }),
        }),
        new VectorLayer({
          source: new VectorSource({
            url: "../../../../../assets/media/json/map-export.json",
            format: new GeoJSON(),
          }),
          style: function (feature) {
            const label = feature.get('short_name');
            const style = new Style({
              text: new Text({
                font: '14px Calibri,sans-serif',
                text: label,
                textAlign: 'center',
                overflow: true,
                fill: new Fill({
                  color: '#000',
                }),
                stroke: new Stroke({
                  color: '#fff',
                  width: 3,
                }),
              }),
              stroke: new Stroke({
                color: "rgba(0, 0, 255, 0.3)",
                width: 1,
              }),
              fill: new Fill({
                color: "rgba(255, 255, 255, 0.3)",
              }),
            });
            return [style];
          },
          declutter: true,
        }),
      ],
    }),
  ];

  ngOnInit(): void {
    const overlay = new Overlay({
      element: this.document.getElementById("popup"),
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    this.map = new Map({
      layers: this.layers,
      overlays: [overlay],
      target: "map",
      view: new View({
        center: [105.692003522920217, 20.861604326816312],
        zoom: 15,
        projection: getProjection('EPSG:4326')
      }),
    });

    this.featureOverlay = new VectorLayer({
      source: new VectorSource(),
      map: this.map,
      style: new Style({
        stroke: new Stroke({
          color: "rgba(255, 255, 255, 0.2)",
          width: 3,
        }),
        fill: new Fill({
          color: "rgba(255, 255, 255, 1)",
        }),
      }),
    });

    this.map.on("click", (evt) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        return feature;
      });

      if (feature && feature.get('So_thua')) {
        this.showPopup(evt, overlay);
      }
    });
    this.map.addInteraction(this.modify);

    const closer = this.document.getElementById("popup-closer");
    if (closer) {
      closer.addEventListener("click", () => {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      });
    }

    this.map.addControl(new ToggleVectorControl({}));
    this.map.addControl(new ToggleRasterControl({}));
    this.map.addControl(new ToggleAreaControl({}));

    setTimeout(() => {
      if (this.map) {
        this.map.setTarget(this.elementRef.nativeElement);
      }
    }, 1000);
    this.setup(this.map.getLayerGroup());
    let caculateArea = this.document.getElementById("toggle-area");

    if (caculateArea) {
      caculateArea.addEventListener("click", () => {
        this.addInteraction("Polygon", overlay);
      });
    }
  }

  setup(group) {
    group.getLayers().forEach((layer) => {
      if (layer instanceof LayerGroup) {
        layer.getLayers().forEach((layer, i) => {
          this.bindInputs(i, layer);
        });
      }
    });
  }

  bindInputs(layerid, layer) {
    let tv = this.document.getElementById("toggle-vector");
    let tr = this.document.getElementById("toggle-raster");

    if (tv && layerid === 1) {
      tv.addEventListener("click", () => {
        const visible = !layer.getVisible();
        layer.setVisible(visible);
      });
    }

    if (tr && layerid === 0) {
      tr.addEventListener("click", () => {
        const visible = !layer.getVisible();
        layer.setVisible(visible);
      });
    }
  }

  showPopup(evt, overlay) {
    const feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature) => {
      return feature;
    });

    if (!feature) {
      return;
    }
    const coordinate = evt.coordinate;
    const content = this.document.getElementById("popup-content");
    if (content) {
      content.innerHTML =
        "Số thửa: " + feature.get('So_thua')
        + " <br> Diện tích: " + this.formatArea(feature.get('geometry'))
        + " <br> Chu vi: " + this.formatLength(feature.get('geometry'))
        + " <br> Loại ruộng: " + feature.get('Loai_ruong')
        + '<hr />'
    }
    overlay.setPosition(coordinate);
    if (feature !== this.highlight) {
      if (this.highlight) {
        this.featureOverlay.getSource().removeFeature(this.highlight);
      }
      if (feature) {
        this.featureOverlay.getSource().addFeature(feature);
      }
      this.highlight = feature;
    }
    this.filter = {
      area: this.formatArea(feature.get('geometry')),
      perimeter: this.formatLength(feature.get('geometry')),
      slot: feature.get('So_thua'),
      type: feature.get('Loai_ruong'),
      coordinate
    };
  }

  showDetail() {
    this.ref.detectChanges();
    let toggleBtn = document.getElementById("kt_quick_custom_toggle");
    if (toggleBtn) {
      toggleBtn.click();
    }
  }

  formatLength(line) {
    const length = getLength(line, {
      projection: 'EPSG:4326'
    });
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 1000) / 1000 + " km";
    } else {
      output = Math.round(length * 1000) / 1000 + " m";
    }
    return output;
  }

  formatArea(polygon) {
    const area = getArea(polygon, {
      projection: 'EPSG:4326'
    });
    let output;
    if (area > 10000) {
      output = Math.round((area / 10000) * 1000) / 1000 + " ha";
    } else {
      output = Math.round(area * 1000) / 1000 + " m\xB2";
    }
    return output;
  }

  styleFunction(feature, segments, drawType = null, tip = null) {
    const styles = [this.style];
    const geometry = feature.getGeometry();
    const type = geometry.getType();
    let point, label, line;

    if (!drawType || drawType === type) {
      if (type === "Polygon") {
        point = geometry.getInteriorPoint();
        label = this.formatArea(geometry);
        line = new LineString(geometry.getCoordinates()[0]);
      } else if (type === "LineString") {
        point = new Point(geometry.getLastCoordinate());
        label = this.formatLength(geometry);
        line = geometry;
      }
    }
    if (segments && line) {
      let count = 0;
      line.forEachSegment((a, b) => {
        const segment = new LineString([a, b]);
        const label = this.formatLength(segment);
        if (this.segmentStyles.length - 1 < count) {
          this.segmentStyles.push(this.segmentStyle.clone());
        }
        const segmentPoint = new Point(segment.getCoordinateAt(0.5));
        this.segmentStyles[count].setGeometry(segmentPoint);
        this.segmentStyles[count].getText().setText(label);
        styles.push(this.segmentStyles[count]);
        count++;
      });
    }
    if (label) {
      this.labelStyle.setGeometry(point);
      this.labelStyle.getText().setText(label);
      styles.push(this.labelStyle);
    }
    if (
      tip &&
      type === "Point" &&
      !this.modify.getOverlay().getSource().getFeatures().length
    ) {
      this.tipPoint = geometry;
      this.tipStyle.getText().setText(tip);
      styles.push(this.tipStyle);
    }
    return styles;
  }

  addInteraction(drawType, overlay) {
    const activeTip =
      "Click để bắt đầu vẽ " +
      (drawType === "Polygon" ? "polygon" : "LineString");
    const idleTip = "Click to start measuring";
    let tip = idleTip;
    this.draw = new Draw({
      source: this.source,
      type: drawType,
      style: (feature) => {
        return this.styleFunction(feature, true, drawType, tip);
      },
    });
    this.draw.on("drawstart", (evt) => {
      if (true) {
        this.source.clear();
      }
      this.modify.setActive(false);
      tip = activeTip;
    });

    this.draw.on("drawend", (evt: DrawEvent) => {
      if (drawType === 'Polygon') {
        // this.showInfoDetail(this.formatArea(evt.feature.getGeometry()), 0, 0, 'NONE', (evt.feature.getGeometry() as Polygon).getLinearRing(0).getCoordinates()[0]);
      }
      if (evt.feature.getGeometry() instanceof Polygon) {
        this.map.removeInteraction(this.draw);
      }
      this.modifyStyle.setGeometry(this.tipPoint);
      this.modify.setActive(true);
      tip = idleTip;
    });
    this.modify.setActive(true);
    this.map.addInteraction(this.draw);
  }
}

export class ToggleVectorControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options?) {
    const options = opt_options || {};

    const element = document.createElement("button");
    element.innerHTML = "V";
    element.className = "toggle-vector ol-unselectable ol-control fit-content";
    element.id = "toggle-vector";

    super({
      element: element,
      target: options.target,
    });
  }
}

export class ToggleRasterControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options?) {
    const options = opt_options || {};

    const element = document.createElement("button");
    element.innerHTML = "R";
    element.className = "toggle-raster ol-unselectable ol-control fit-content";
    element.id = "toggle-raster";

    super({
      element: element,
      target: options.target,
    });
  }
}

/**
 * Đo diện tích
 */
export class ToggleAreaControl extends Control {
  /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options?) {
    const options = opt_options || {};

    const element = document.createElement("button");
    element.innerHTML = "A";
    element.className = "ol-unselectable ol-control fit-content";
    element.id = "toggle-area";

    super({
      element: element,
      target: options.target,
    });
  }
}

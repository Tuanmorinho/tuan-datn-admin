import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StyleService {
  private stylesMap: Map<any, Node> = new Map();
  private host: Node;

  private _styleValue$: Subject<{ key: string, value: string | number }> = new BehaviorSubject(null);

  constructor() {
    this.host = document.head;
  }

  get styleValue$() {
    return this._styleValue$.asObservable();
  }

  set styleValue(value: { key: string, value: string | number }) {
    this._styleValue$.next(value);
  }

  private createStyleNode(content: string): Node {
    const styleEl = document.createElement('style');
    styleEl.textContent = content;
    return styleEl;
  }

  addStyle(key: any, style: string): void {
    const styleEl = this.createStyleNode(style);
    this.stylesMap.set(key, styleEl);
    this.host.appendChild(styleEl);
  }

  removeStyle(key: any): void {
    const styleEl = this.stylesMap.get(key);
    if (styleEl) {
      this.stylesMap.delete(key);
      this.host.removeChild(styleEl);
    }
  }


  getStyle(el: Element, styleProp: string): string {
    let value;
    const defaultView = el.ownerDocument.defaultView;
    // W3C standard way:
    if (defaultView && defaultView.getComputedStyle) {
      // sanitize property name to css notation (hypen separated words eg. font-Size)
      styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase();
      return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
    } else if (el['currentStyle']) { // IE
      // sanitize property name to camelCase
      styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
        return letter.toUpperCase();
      });
      value = el['currentStyle'][styleProp];
      return value;
    }
    return '';
  }

  getClassName(id: string): string[] {
    return document.getElementById(id)?.className?.split(' ');
  }

  setClassName(id: string, className: string) {
    let el = document.getElementById(id);
    if (el.classList.contains(className)) el.classList.add(className);
  }

  toggleClassName(id: string, className: string) {
    let el = document.getElementById(id);
    el?.classList.toggle(className);
  }

  toggleClassNameByClassName(className: string, cls: string) {
    let el = document.querySelector('.' + className);
    el?.classList.toggle(cls);
  }

  removeClassName(id: string, className: string) {
    let el = document.getElementById(id);
    if (el.classList.contains(className)) el.classList.remove(className);
  }
}

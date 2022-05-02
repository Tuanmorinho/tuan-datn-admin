import { Injectable } from '@angular/core';

export class InmemoryStorage {
  data: { [key: string]: string } = {};

  setItem(key: string, data: any) {
    this.data[key] = String(data);
  }

  getItem(key: string) {
    return this.data[key] || null;
  }

  deleteItem(key: string) {
    delete this.data[key];
  }
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  prefix = 'app';
  localStorage: any;

  constructor() {
    this.localStorage = window.localStorage || new InmemoryStorage();
  }

  public set(key: string, data: any) {
    this.localStorage.setItem(this.generateKey(key), data);
  }

  public get(key: string) {
    return this.localStorage.getItem(this.generateKey(key));
  }

  public setSession(key: string, data: any) {
    sessionStorage.setItem(this.generateKey(key), data);
  }

  public getSession(key: string) {
    return sessionStorage.getItem(this.generateKey(key));
  }

  public unset(key: string) {
    this.localStorage.removeItem(this.generateKey(key));
  }

  private generateKey(key: string) {
    return this.prefix + '_' + key;
  }
}
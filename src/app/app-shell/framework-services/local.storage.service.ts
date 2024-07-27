import { Injectable } from "@angular/core"

@Injectable()
export class LocalStorageService {
  getItem(name: string): string {
    return localStorage.getItem(name)
  }

  setItem(name: string, value: string): void {
    if (this.exists(name))
      this.removeItem(name)

    localStorage.setItem(name, value)
  }

  exists(name: string): boolean {
    if (this.getItem(name) == null)
      return false
    return true
  }

  removeItem(name: string): void {
    localStorage.removeItem(name)
  }
}

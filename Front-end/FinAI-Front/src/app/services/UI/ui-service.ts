import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  public title = signal<string>('Dashboard')
  public subTitle = signal<string>('Personal finance summary')

  updateHeader(newTitle: string, newSubtitle: string) {
    this.title.set(newTitle)
    this.subTitle.set(newSubtitle)
  }
}

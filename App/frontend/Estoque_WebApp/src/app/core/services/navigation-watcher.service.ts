import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationWatcherService {
// Observable que emite a cada NavigationEnd
  private navigationSubject = new Subject<void>();
  public navigation$ = this.navigationSubject.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.navigationSubject.next(); // emite sinal de navegação
      });
  }
}

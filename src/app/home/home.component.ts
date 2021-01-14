// angular
import { Component, OnInit, OnDestroy } from '@angular/core';
// custom
import { SeoService } from '../shared/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private typed: any;

  constructor(private seoService: SeoService) {

    this.seoService.config({ title: 'Home', url: 'home' });

  }

  async ngOnInit(): Promise<void> {

    const Typed = await import(
      /* webpackMode: "lazy" */
      'typed.js'
    ).then((res) => res.default);

    this.typed = new Typed('.typed', {
      strings: [
        'Angular',
        'Angular Flex-Layout',
        'Angular Material',
        'Angular Cdk',
        'NgRX',
        'RxJS',
        'and many others 😉'
      ],
      typeSpeed: 25,
      startDelay: 1000,
      backSpeed: 25,
      smartBackspace: true,
      loop: true,
      showCursor: true
    });

  }

  ngOnDestroy(): void {

    this.typed.destroy();

  }

}

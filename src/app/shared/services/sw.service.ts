// angular
import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class SwService {

  constructor(private sw: SwUpdate) { }

  update(): void {

    if (this.sw.isEnabled) {
      this.sw.available
        .subscribe((res) => this.sw.activateUpdate());
    }

  }
}

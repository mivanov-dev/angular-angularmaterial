// angular
import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class SwService {

  constructor(private swu: SwUpdate) { }

  update(): void {

    if (this.swu.isEnabled) {
      this.swu.available
        .subscribe((res) => this.swu.activateUpdate());
    }

  }
}

// angular
import {
  Component, Input, ChangeDetectionStrategy,
  Output, EventEmitter, NgModule
} from '@angular/core';
import { CommonModule } from '@angular/common';
// material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent {

  @Input() message?: string;
  @Input() hasError?: boolean;
  // tslint:disable-next-line: no-output-native
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  onClose(): void {

    this.close.emit(true);

  }

}

@NgModule({
  imports: [CommonModule, MatCardModule, MatButtonModule],
  declarations: [AlertComponent]
})
class AlertModule { }

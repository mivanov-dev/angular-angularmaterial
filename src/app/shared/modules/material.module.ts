// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// angular-material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card/';
import { MatCheckboxModule } from '@angular/material/checkbox/';
import { MatChipsModule } from '@angular/material/chips/';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
// cdk
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
    imports: [
        CommonModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatGridListModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        ScrollingModule,
        MatCheckboxModule,
        MatChipsModule
    ],
    exports: [
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatGridListModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        ScrollingModule,
        MatCheckboxModule,
        MatChipsModule
    ]
})
export class MaterialModule { }
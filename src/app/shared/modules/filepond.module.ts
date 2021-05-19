// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// flex-layout
import { FilePondModule, registerPlugin } from 'ngx-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
// @ts-ignore
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';
registerPlugin(
  // FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageValidateSize
);

@NgModule({
  imports: [
    CommonModule,
    FilePondModule
  ],
  exports: [
    FilePondModule
  ]
})
export class FilepondModule { }

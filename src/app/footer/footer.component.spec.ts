import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {

    expect(component).toBeDefined();
    expect(component).toBeTruthy();

  });

  it('should have ".footer-container .mat-small" with "Powered by © Milen Hristov Ivanov | 2021"', () => {

    const dom = fixture.nativeElement as HTMLElement;
    const span = dom.querySelector('.footer-container .mat-small');
    expect(span?.textContent).toEqual('Powered by © Milen Hristov Ivanov | 2021');

  });
});

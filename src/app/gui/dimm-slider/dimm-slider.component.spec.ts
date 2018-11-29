import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DimmSliderComponent } from './dimm-slider.component';

describe('DimmSliderComponent', () => {
  let component: DimmSliderComponent;
  let fixture: ComponentFixture<DimmSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DimmSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimmSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

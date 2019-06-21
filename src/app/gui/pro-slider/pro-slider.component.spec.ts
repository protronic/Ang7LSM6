import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSliderComponent } from './pro-slider.component';

describe('ProSliderComponent', () => {
  let component: ProSliderComponent;
  let fixture: ComponentFixture<ProSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

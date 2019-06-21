import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSelectComponent } from './pro-select.component';

describe('ProSelectComponent', () => {
  let component: ProSelectComponent;
  let fixture: ComponentFixture<ProSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

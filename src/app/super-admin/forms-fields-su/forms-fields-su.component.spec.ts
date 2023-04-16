import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsFieldsSuComponent } from './forms-fields-su.component';

describe('FormsFieldsSuComponent', () => {
  let component: FormsFieldsSuComponent;
  let fixture: ComponentFixture<FormsFieldsSuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormsFieldsSuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsFieldsSuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

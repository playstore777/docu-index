import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewSuComponent } from './pdf-view-su.component';

describe('PdfViewSuComponent', () => {
  let component: PdfViewSuComponent;
  let fixture: ComponentFixture<PdfViewSuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfViewSuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfViewSuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

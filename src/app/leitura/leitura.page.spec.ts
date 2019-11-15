import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeituraPage } from './leitura.page';

describe('LeituraPage', () => {
  let component: LeituraPage;
  let fixture: ComponentFixture<LeituraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeituraPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeituraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

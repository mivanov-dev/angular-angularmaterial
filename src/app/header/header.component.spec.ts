// angular
import { ComponentFixture, fakeAsync, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardAvatar, MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// ngrx
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MemoizedSelector, Store } from '@ngrx/store';
// rxjs
import { of } from 'rxjs';
// custom
import { HeaderComponent } from './header.component';
import * as fromApp from '../store';
import * as fromAuth from '../user/auth/store/reducer';
import * as AuthActions from '../user/auth/store/actions';
import * as AuthModels from '../user/auth/store/models';
import { ImageFallbackDirective } from '../shared/directives';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: MockStore<fromAuth.State>;
  let dom: HTMLElement;
  const userProfileBtn = '.user-profile-btn';
  let mockUserSelector: any;
  const initialState: fromAuth.State = {
    authMode: {
      mode: 'login'
    },
    register: null,
    login: null,
    loading: false,
    error: null
  };
  const loggedUser: AuthModels.Login = {
    email: 'email@email.com',
    expires: 1000,
    redirect: false,
    image: '../../assets/user.png',
    role: 'USER',
    is2FAenabled: false
  };

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        ImageFallbackDirective,
        MatMenuTrigger,
        MatCardAvatar,
        HeaderComponent
      ],
      imports: [
        MatToolbarModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule
      ],
      providers: [
        provideMockStore({ initialState })
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(HeaderComponent);

    component = fixture.debugElement.componentInstance;
    component.userImage = '../../assets/user.png';
    component.adminImage = '../../assets/admin.png';

    store = TestBed.inject(MockStore);

    dom = fixture.nativeElement as HTMLElement;

    mockUserSelector = store.overrideSelector(fromAuth.selectLogin, null);

    fixture.detectChanges();

    spyOn(store, 'dispatch').and.callFake(() => { });

  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create component', () => {

    expect(component).toBeDefined();
    expect(component).toBeTruthy();

  });

  it('should dispatch an onLogout event', () => {

    const action = AuthActions.logoutStart();
    component.logout();
    expect(store.dispatch).toHaveBeenCalledWith(action);

  });

  it('should dispatch a switchAuthModeTo event', () => {

    const mode = 'login';
    const action = AuthActions.switchModeTo({ authMode: { mode } });
    component.switchModeTo(mode);
    expect(store.dispatch).toHaveBeenCalledWith(action);

  });

  it('should show user image if user is logged in', fakeAsync(() => {

    store.setState({
      ...initialState,
      login: loggedUser
    });

    mockUserSelector.setResult(loggedUser);

    store.refreshState();
    fixture.detectChanges();

    expect(dom.querySelector(userProfileBtn)).not.toBeNull();

  }));

});

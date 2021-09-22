// angular
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatCardAvatar, MatCardModule } from '@angular/material/card';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
// ngrx
import { provideMockStore, MockStore } from '@ngrx/store/testing';
// custom
import { HeaderComponent } from './header.component';
import * as fromAuth from '@app/user/auth/store/reducer';
import * as AuthActions from '@app/user/auth/store/actions';
import * as AuthModels from '@app/user/auth/store/models';
import { ImageFallbackDirective } from '@app/shared/directives';
import { ThemeData, ThemeService } from '@app/shared/services';
import { ProviderModule } from '@app/provider.module';
import * as fromApp from '@app/store';

describe('HeaderComponent', () => {

  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: MockStore<fromApp.AppState>;
  let themeService: ThemeService;
  let dom: HTMLElement;
  const userProfileBtn = '.user-avatar';
  const initialAuthState: fromAuth.State = {
    authMode: {
      mode: 'login'
    },
    register: null,
    login: null,
    loading: false,
    error: null
  };
  const initialAppState: fromApp.AppState = {
    'forgot-password': { error: null, forgotPassword: null, loading: false },
    'reset-password': { error: null, loading: false },
    auth: initialAuthState,
    comments: {
      loading: false,
      error: null,
      hasMore: false,
      ids: [],
      entities: [] as any
    },
    qr: {
      setup: null,
      verify: null,
      error: null,
      loading: false,
    },
    router: { navigationId: 0, state: null }
  };

  const themeServiceMock = jasmine.createSpyObj<ThemeService>(
    'ThemeService',
    ['initTheme', 'switchTheme']
  );
  const switchThemeServiceMock = themeServiceMock
    .switchTheme
    .and
    .returnValue({ isDark: false, themeClass: 'light-theme' } as ThemeData);
  const themesData: ThemeData[] = [
    { isDark: false, themeClass: 'light-theme' },
    { isDark: true, themeClass: 'dark-theme' }
  ];

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        ImageFallbackDirective,
        MatMenuTrigger,
        MatCardAvatar
      ],
      imports: [
        BrowserAnimationsModule,
        MatToolbarModule,
        MatMenuModule,
        MatIconModule,
        MatCardModule,
        ProviderModule,
      ],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        {
          provide: ThemeService,
          useValue: themeServiceMock
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    fixture = TestBed.createComponent(HeaderComponent);

    component = fixture.debugElement.componentInstance;
    component.userImage = '../../assets/user.png';
    component.adminImage = '../../assets/admin.png';

    store = TestBed.inject(MockStore);
    themeService = TestBed.inject(ThemeService);

    dom = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    // tslint:disable:no-empty
    spyOn(store, 'dispatch').and.callFake(() => { });

  });

  afterEach(() => {

    fixture.destroy();

  });

  it('should create component', () => {

    expect(component).toBeDefined();
    expect(component).toBeTruthy();

  });

  themesData.forEach((e) => {

    it(`switchTheme ${e.isDark ? 'dark-theme to light-theme' : 'light-theme to dark-theme'}`, () => {

      switchThemeServiceMock.and.returnValue(e);
      component.switchTheme();

      expect(component.isDark).toEqual(e.isDark);
      expect(component.themeClass).toEqual(e.themeClass);

    });

  });

  describe('dispatch', () => {

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

  });

  describe('selector', () => {

    let mockAuthSelector: any;
    const user: AuthModels.LoggedUser = {
      email: 'email@email.com',
      expires: 1000,
      redirect: false,
      image: '../../assets/user.png',
      role: 'USER',
      is2FAenabled: false
    };

    beforeEach(() => {

      mockAuthSelector = store.overrideSelector(fromAuth.selectLogin, { user } as AuthModels.Login);
      fixture.detectChanges();

    });

    it('should show user image if user is logged in', fakeAsync(() => {

      const state: fromApp.AppState = {
        ...initialAppState,
        auth: {
          authMode: {
            mode: 'login'
          },
          register: null,
          login: { user },
          loading: false,
          error: null
        },
      };

      store.setState(state);
      mockAuthSelector.setResult({ user });
      store.refreshState();
      fixture.detectChanges();
      tick(100);
      expect(dom.querySelector(userProfileBtn)).not.toBeNull();

    }));

  });

});

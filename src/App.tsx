import './App.module.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AppHeader } from './components/app-header/app-header';
import { SkillCardsContainer } from './components/skill-card-container/skill-cards.tsx';
import { FiltersSidebar } from './components/filters-sidebar/filters-sidebar.tsx';
import { ActiveFiltersBar } from './components/active-filters-bar/active-filters-bar.tsx';
import { Footer } from './components/footer/footer.tsx';
import { RegisterPage } from './pages/register';
import { SkillDetailPage } from './pages/skill-detail/skill-detail.tsx';
import styles from './App.module.css';
import { LoginPage } from './pages/login';
import { ProfilePage } from './pages/profile';
import { RequestsPage } from './pages/requests/request-page.tsx';
import { useEffect } from 'react';
import { getUserThunk } from './slices/authSlice.ts';
import type { AppDispatch, RootState } from './services/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { FavoritesPage } from './pages/favorites-page/favorites-page.tsx';
import { ExchangesPage } from './pages/exchanges-page/exchanges-page.tsx';
import { MySkillsPage } from './pages/my-skill-page/my-skill-page.tsx';
import { FiltersDrawer } from './components/filters-drawer/filters-drawer.tsx';
import { NotFoundPage } from './pages/not-found/not-found.tsx';
import { RequestStatusWatcher } from './components/request-status-watcher/request-status-watcher.tsx';
import { BadgeWatcher } from './components/badge-watcher/badge-watcher.tsx';
import { getFavoritesThunk } from './slices/favoritesSlice.ts';
import { getMarksIdsThunk } from './slices/notificationSlice.ts';
import { getProfileThunk } from './slices/profileSlice.ts';

const HomePage = () => (
  <main className={styles.pageLayout}>
    <div className={styles.sidebarDesktop}>
      <FiltersSidebar />
    </div>
    <FiltersDrawer />
    <div className={styles.content}>
      <ActiveFiltersBar />
      <SkillCardsContainer />
    </div>
  </main>
);

const CatalogPage = () => (
  <main className={styles.pageLayout}>
    <div className={styles.sidebarDesktop}>
      <FiltersSidebar />
    </div>
    <FiltersDrawer />
    <div className={styles.content}>
      <ActiveFiltersBar />
      <SkillCardsContainer forceShowAll />
    </div>
  </main>
);

const AUTH_ROUTES = ['/login', '/register'];

const App = () => {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const theme = useSelector((state: RootState) => state.theme.value);

  useEffect(() => {
    dispatch(getProfileThunk());
  }, [dispatch]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => {
    dispatch(getMarksIdsThunk());
  }, []);
  useEffect(() => {
    dispatch(getFavoritesThunk());
  }, []);
  useEffect(() => {
    if (token && !user) {
      dispatch(getUserThunk(token));
    }
  }, [token, user, dispatch]);
  return (
    <>
      {!isAuthPage && <AppHeader />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/catalog' element={<CatalogPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/skill/:userId' element={<SkillDetailPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/requests' element={<RequestsPage />} />
        <Route path='/favorites' element={<FavoritesPage />} />
        <Route path='/exchanges' element={<ExchangesPage />} />
        <Route path='/my-skills' element={<MySkillsPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      {!isAuthPage && <Footer />}
      <BadgeWatcher />
      <RequestStatusWatcher />
    </>
  );
};

export default App;

import { AddEditPeoplePage } from '@/pages/add-edit-people';
import { PeoplePage } from '@/features/people/page';
import { NotFoundPage } from '@/pages/not-found';
import { ReactElement } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '../theme/provider';
import { AppHeader } from './header';

export const App = (): ReactElement => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route index element={<PeoplePage />} />
          <Route path="/people/new" element={<AddEditPeoplePage />} />
          <Route path="/people/edit/:id" element={<AddEditPeoplePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

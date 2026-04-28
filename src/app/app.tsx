import { AddEditPeoplePage } from '@/pages/add-edit-people';
import { PeoplePage } from '@/features/people/page';
import { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

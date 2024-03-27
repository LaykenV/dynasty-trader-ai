import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import LoginPage from './pages/loginPage.tsx';
import Dashboard from './pages/dashboard.tsx';
import { TimesheetProvider } from './context/timesheetContext.tsx';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage></LoginPage>
  },
  {
    path: '/dashboard',
    element: <Dashboard></Dashboard>
  }
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TimesheetProvider>
      <MantineProvider>
        <RouterProvider router={router}/>
      </MantineProvider>
    </TimesheetProvider>
  </React.StrictMode>,
);

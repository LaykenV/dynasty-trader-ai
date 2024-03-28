import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import LoginPage from './pages/loginPage.tsx';
import Dashboard from './pages/dashboard.tsx';
import { TimesheetProvider } from './context/timesheetContext.tsx';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'
import { MantineProvider } from '@mantine/core';
import Layout from './pages/layout.tsx';
import AccountPage from './pages/account.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage></LoginPage>
  },
  {
    path: '/dashboard',
    element: <Layout><Dashboard></Dashboard></Layout>
  },
  {
    path: '/account',
    element: <Layout><AccountPage></AccountPage></Layout>
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

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'
import './index.css'
import App from './App.jsx'
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { seedDemoDataOnce } from './utils/localDemoData.js';

seedDemoDataOnce();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <Notifications/>
    <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
)

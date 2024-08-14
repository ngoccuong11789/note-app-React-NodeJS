import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom';
import './index.css'
import router from './router/index.jsx';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container } from '@mui/material';
import './firebase/config.jsx';

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <Container maxWidth='lg' sx={{textAlign: 'center', marginTop: '50px'}}>
      <RouterProvider router={router}></RouterProvider>
    </Container>

  //</StrictMode>,
)

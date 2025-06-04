import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import ChessGame from './components/ChessGame.jsx';
import Analyze from './components/Analyze.jsx';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/game/:mode',
    element: <ChessGame />,
  },
  {
    path: '/analyze',
    element: <Analyze />,
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import { auth } from './firebase/firebase.config';
import { setUser } from './redux/authSlice';
import { router } from './router/Router.jsx';
import { store } from './redux/store.js';
import { onAuthStateChanged } from 'firebase/auth';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

onAuthStateChanged(auth, (currentUser) => {
  store.dispatch(setUser(currentUser));
});

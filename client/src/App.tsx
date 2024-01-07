import { ThemeProvider } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import AppTheme from './styles/AppTheme';
import WrappedRoutes from './components/Routes';

function App() {
  return (
    <ThemeProvider theme={AppTheme}>
      <Provider store={store}>
        <Toaster toastOptions={{duration: 1500}}/>
            <AnimatePresence mode="wait">
              <BrowserRouter>
                <WrappedRoutes />
              </BrowserRouter>
            </AnimatePresence>
      </Provider>
    </ThemeProvider>
  );
}

export default App;

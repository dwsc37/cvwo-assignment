import { ThemeProvider } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import WrappedRoutes from './components/Routes';
import store from './redux/store';
import AppTheme from './styles/AppTheme';

function App() {
  return (
    <ThemeProvider theme={AppTheme}>
      <Provider store={store}>
        <Toaster toastOptions={{duration: 1500}}/>
              <BrowserRouter>
                <WrappedRoutes />
              </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;

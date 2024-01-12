import { CssBaseline, ThemeProvider } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import RoutesWrapper from './components/wrappers/RoutesWrapper';
import store from './redux/store';
import AppTheme from './styles/AppTheme';


function App() {
  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <Provider store={store}>
        <Toaster toastOptions={{duration: 1500}}/>
              <BrowserRouter>
                <RoutesWrapper />
              </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;

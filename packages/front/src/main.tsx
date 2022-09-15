import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ApiProvider } from '@baby-tracker/common-front';
import { apis, store } from './core';
import { App } from './App';
import { theme } from './theme';
import { AxiosInterceptor } from './core/router/AxiosInterceptor';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ApiProvider apis={apis}>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AxiosInterceptor />
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </ApiProvider>
);

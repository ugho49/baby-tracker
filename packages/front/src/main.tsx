import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { ApiProvider } from './apis/system/ApiContext';
import { apis } from './apis';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <ApiProvider apis={apis}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApiProvider>
  </StrictMode>
);

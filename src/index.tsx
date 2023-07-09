import './index.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { Notifications } from '@mantine/notifications';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Authenticator } from 'src/components/authentication/authenticator.component';
import { LoginScreen } from 'src/components/authentication/login/login.screen';
import { ErrorBoundary } from 'src/components/error-boundary/ErrorBoundary';
import { PageNotFound } from 'src/components/http/not-found.page';
import { Theme } from 'src/components/mantine/mantine.config';
import { ScrollTo } from 'src/components/scroll/scroll.component';
import { Translate } from 'src/components/translate/translate.component';
import reportWebVitals from 'src/reportWebVitals';
import { AboutScreen } from 'src/screens/about/about.screen';
import { ScreenHostOverview } from 'src/screens/host/overview/overview.component';
import { ScreenStorageOverview } from 'src/screens/storage/overview/overview.component';
import { store } from 'src/store/store';

/**
 * Screens
 */
import App from './App';
import { AppConfig } from './app.config';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const strickMode = process.env.NODE_ENV === 'production';
const Content = (): React.JSX.Element => (
  <ErrorBoundary>
    <BrowserRouter>
      <ScrollTo />
      <Theme>
        <Notifications autoClose={AppConfig.notification.timeout} />
        <Provider store={store}>
          <Translate current="en">
            <Routes>
              <Route path="/" element={<App />}>
                <Route path="" element={<Navigate to="storage" />} />
                <Route path="storage/:storageId?/:poolId?" element={<ScreenStorageOverview />} />
                <Route path="host/:hostId?" element={<ScreenHostOverview />} />
                <Route
                  path="about"
                  element={
                    <Authenticator.Navigate>
                      <AboutScreen />
                    </Authenticator.Navigate>
                  }
                />
              </Route>
              <Route path="login" element={<LoginScreen />} />
              <Route path="*" element={<PageNotFound />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Translate>
        </Provider>
      </Theme>
    </BrowserRouter>
  </ErrorBoundary>
);

root.render(
  (strickMode && (
    <React.StrictMode>
      <Content />
    </React.StrictMode>
  )) || <Content />,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

window.getVersion = (): any => process.env;

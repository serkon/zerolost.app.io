import './index.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Authenticator } from 'src/components/authentication/authenticator.component';
import { LoginScreen } from 'src/components/authentication/login/login.screen';
import { PageNotFound } from 'src/components/http/not-found.page';
import { ScrollTo } from 'src/components/scroll/scroll.component';
import { Translate } from 'src/components/translate/translate.component';
import reportWebVitals from 'src/reportWebVitals';
import { store } from 'src/store/store';

/**
 * Screens
 */
import App from './App';
import { AboutScreen } from './screens/about/about.screen';
import { HomeScreen } from './screens/home/home.screen';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const strickMode = process.env.NODE_ENV === 'production';
const Content = (): React.JSX.Element => (
  <BrowserRouter>
    <ScrollTo />
    <Provider store={store}>
      <Translate current="en">
        <Routes>
          <Route path="/" element={<App />}>
            <Route
              path=""
              element={
                <Authenticator.Navigate>
                  <HomeScreen />
                </Authenticator.Navigate>
              }
            />
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
  </BrowserRouter>
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

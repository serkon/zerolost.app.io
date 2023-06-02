import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

test('renders learn react link', () => {
  render(<BrowserRouter><App /></BrowserRouter>);
  // const linkElement = screen.getByText(/main/i);
  const linkElement = screen.getByTitle(/logo/i);

  expect(linkElement).toBeInTheDocument();
});

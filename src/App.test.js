// src/App.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders loading text or main app layout', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Kiểm tra xem ứng dụng có render trạng thái loading ban đầu hay không
  const loadingElement = screen.getByText(/Đang tải câu hỏi.../i);
  expect(loadingElement).toBeInTheDocument();
});
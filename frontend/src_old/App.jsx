import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VuzPage from './pages/VuzPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vuz/:id" element={<VuzPage />} />
      </Routes>
    </BrowserRouter>
  );
}
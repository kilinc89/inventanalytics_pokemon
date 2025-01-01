// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import DetailPage from './pages/DetailPage.tsx';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:imdbID" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

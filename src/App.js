
import './App.css';
import Uploadpage from './components/UploadPage';
import Dashboard from './components/Dashboard';
import Subscribe from './components/Subscribe';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<Uploadpage />} />
        <Route path="/subscribe" element={<Subscribe />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;

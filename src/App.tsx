import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './pages/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserGallery from './pages/UserGallery';
import Navigation from './pages/Navigation';
import UserPage from './pages/UserPage';
import Favorites from './pages/Favorites';
import PhotoDetails from './pages/PhotoDetail';

function App() {
  return (
    <Router>
      <Navigation /> {}
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/my-photos" element={<UserGallery />} />
          <Route path="/photos/:id" element={<PhotoDetails />} />
          <Route path="/user/:id" element={<UserPage />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
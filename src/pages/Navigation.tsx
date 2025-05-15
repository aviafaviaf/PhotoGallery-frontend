import { Link, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-lg">
          <Link to="/">Фотогалерея</Link>
        </div>
        <div className="space-x-4">
          <Link
            to="/"
            className="text-white hover:text-gray-300"
          >
            Главная
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/my-photos"
                className="text-white hover:text-gray-300"
              >
                Мои фото
              </Link>
              <Link to="/favorites" className="text-white hover:text-gray-300">
                Избранное
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300 bg-red-600 px-4 py-2 rounded"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-gray-300"
              >
                Вход
              </Link>
              <Link
                to="/register"
                className="text-white hover:text-gray-300"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

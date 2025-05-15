import { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import { Link, useNavigate } from 'react-router-dom';

interface Photo {
  id: number;
  url: string;
  title: string;
  user_id: number;
  username: string;
  is_published: boolean;
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 9;

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await api.get(`/photos?page=${page}&limit=${limit}`);
      setPhotos(res.data);

      const nextRes = await api.get(`/photos?page=${page + 1}&limit=${limit}`);
      setHasMore(nextRes.data.length > 0);
    } catch (err) {
      alert('Ошибка при загрузке фото');
    }
  }, [page]);

  const fetchFavorites = useCallback(async () => {
    if (!token) return;

    try {
      const res = await api.get('/photos/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavorites(res.data.map((photo: Photo) => photo.id));
    } catch {

    }
  }, [token]);

  const isFavorite = (photoId: number) => favorites.includes(photoId);

  const toggleFavorite = async (photoId: number, currentlyFavorite: boolean) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (currentlyFavorite) {
        await api.delete(`/photos/${photoId}/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(`/photos/${photoId}/favorite`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchFavorites();
    } catch {
      alert('Ошибка при изменении избранного');
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchFavorites();
  }, [fetchPhotos, fetchFavorites]);

  const handlePrev = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const handleNext = () => {
    if (hasMore) setPage(p => p + 1);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Фотогалерея</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {photos.map(photo => (
          <div key={photo.id} className="border rounded shadow text-center">
            <Link to={`/photos/${photo.id}`}>
              <img
                src={`http://localhost:5000${photo.url}`}
                alt={photo.title}
                className="w-full h-60 object-contain mx-auto rounded-t bg-gray-100"
              />
            </Link>
            <div className="p-2">
              <p className="font-semibold text-center">{photo.title}</p>
              <Link
                to={`/user/${photo.user_id}`}
                className="text-blue-500 hover:underline block text-center"
              >
                @{photo.username}
              </Link>
            </div>
            {token && (
              <button
                onClick={() => toggleFavorite(photo.id, isFavorite(photo.id))}
                className="text-sm text-yellow-500 hover:underline mb-2"
              >
                {isFavorite(photo.id) ? 'Убрать из избранного' : 'В избранное'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Назад
        </button>
        <span className="self-center">Страница {page}</span>
        <button
          onClick={handleNext}
          disabled={!hasMore}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Далее
        </button>
      </div>
    </div>
  );
}

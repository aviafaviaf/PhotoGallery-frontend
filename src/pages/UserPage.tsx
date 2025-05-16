import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import { Link } from 'react-router-dom';


interface Photo {
  id: number;
  url: string;
  title: string;
  username: string;
}

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [username, setUsername] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 9;

  const fetchUserPhotos = useCallback(async () => {
    try {
      const res = await api.get(`/photos/user/${id}?page=${page}&limit=${limit}`);
      const data = res.data;

      setPhotos(data);
      if (data.length > 0) {
        setUsername(data[0].username);
      } else {
        setUsername('');
      }

      const nextRes = await api.get(`/photos/user/${id}?page=${page + 1}&limit=${limit}`);
      setHasMore(nextRes.data.length > 0);
    } catch (err) {
      console.error('Ошибка загрузки фото пользователя:', err);
      setPhotos([]);
      setUsername('');
      setHasMore(false);
    }
  }, [id, page]);

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await api.get('/photos/favorites', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFavorites(res.data.map((photo: Photo) => photo.id));
    } catch {
    }
  }, []);

  const isFavorite = (photoId: number) => favorites.includes(photoId);

  const toggleFavorite = async (photoId: number, currentlyFavorite: boolean) => {
    try {
      if (currentlyFavorite) {
        await api.delete(`/photos/${photoId}/favorite`);
      } else {
        await api.post(`/photos/${photoId}/favorite`);
      }
      fetchFavorites();
    } catch {
      alert('Ошибка при изменении избранного');
    }
  };

  useEffect(() => {
    fetchUserPhotos();
    fetchFavorites();
  }, [fetchUserPhotos, fetchFavorites]);

  const handlePrev = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const handleNext = () => {
    if (hasMore) setPage(p => p + 1);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {username ? `Фотографии пользователя @${username}` : 'У пользователя пока нет фотографий'}
      </h2>

      {photos.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="border rounded p-2 shadow text-center">
                <Link to={`/photos/${photo.id}`}>
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-60 object-contain bg-gray-100 rounded-t"
                />
                </Link>
                <p className="font-semibold mt-2">{photo.title}</p>
                <button
                  onClick={() => toggleFavorite(photo.id, isFavorite(photo.id))}
                  className="text-sm text-yellow-500 hover:underline mt-2"
                >
                  {isFavorite(photo.id) ? 'Убрать из избранного' : 'В избранное'}
                </button>
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
        </>
      ) : (
        <p className="text-gray-500">Нет фотографий для отображения.</p>
      )}
    </div>
  );
}

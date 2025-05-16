import { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';

interface Photo {
  id: number;
  url: string;
  title: string;
  user_id: number;
  username: string;
  is_published: boolean;
}

export default function Favorites() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 9;

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/photos/favorites?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPhotos(res.data);

      const nextRes = await api.get(`/photos/favorites?page=${page + 1}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setHasMore(nextRes.data.length > 0);
    } catch (err) {
      alert('Ошибка при загрузке избранных фото');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemoveFavorite = async (photoId: number) => {
    try {
      await api.delete(`/photos/${photoId}/favorite`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    } catch {
      alert('Ошибка при удалении из избранного');
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const handleNext = () => {
    if (hasMore) setPage(p => p + 1);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Избранные фотографии</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : photos.length === 0 ? (
        <p>Нет избранных фото.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="rounded shadow bg-white p-2">
                <Link to={`/photos/${photo.id}`}>
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-60 object-contain mx-auto rounded-t bg-gray-100"
                />
                </Link>
                <p className="mt-2 text-center">{photo.title}</p>

                <div className="mt-2 flex justify-center">
                  <button
                    onClick={() => handleRemoveFavorite(photo.id)}
                    className="text-sm text-yellow-600 hover:underline"
                  >
                    Удалить из избранного
                  </button>
                </div>
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
      )}
    </div>
  );
}

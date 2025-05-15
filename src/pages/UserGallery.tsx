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

export default function UserGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 9;

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/photos/my?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPhotos(res.data);

      const nextRes = await api.get(`/photos/my?page=${page + 1}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setHasMore(nextRes.data.length > 0);
    } catch (err) {
      alert('Ошибка при получении ваших фото');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Выберите файл');
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('title', title);
    formData.append('is_published', isPublished.toString());

    try {
      await api.post('/photos/upload', formData);
      setTitle('');
      setFile(null);
      setPage(1);
      fetchPhotos();
    } catch (err) {
      alert('Ошибка при загрузке фото');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить это фото?')) return;
    try {
      await api.delete(`/photos/${id}`);
      setPhotos(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Ошибка при удалении фото');
    }
  };

  const handleTogglePublish = async (photoId: number, currentStatus: boolean) => {
    try {
      await api.patch(`/photos/${photoId}/publish`, {
        is_published: !currentStatus,
      });

      setPhotos(prev =>
        prev.map(photo =>
          photo.id === photoId ? { ...photo, is_published: !currentStatus } : photo
        )
      );
    } catch (err) {
      alert('Ошибка при изменении статуса');
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
      <h2 className="text-2xl font-bold mb-4">Загрузка фото</h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Название"
          className="border px-3 py-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={e => setIsPublished(e.target.checked)}
          />
          Опубликовать
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Загрузить
        </button>
      </form>
      <h2 className="text-2xl font-bold mb-4">Мои фотографии</h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : photos.length === 0 ? (
        <p>У вас пока нет фотографий.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="rounded shadow bg-white p-2">
                <Link to={`/photos/${photo.id}`}>
                <img
                  src={`${process.env.REACT_APP_API_URL}${photo.url}`}
                  alt={photo.title}
                  className="w-full h-60 object-contain mx-auto rounded-t bg-gray-100"
                />
                </Link>
                <p className="mt-2 text-center">{photo.title}</p>

                <div className="mt-2 flex justify-between">
                  <button
                    onClick={() => handleTogglePublish(photo.id, photo.is_published)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {photo.is_published ? 'Скрыть' : 'Опубликовать'}
                  </button>

                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Удалить
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

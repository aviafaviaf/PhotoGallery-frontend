import { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import { useParams, Link } from 'react-router-dom';

interface Photo {
  id: number;
  url: string;
  title: string;
  user_id: number;
  username: string;
  is_published: boolean;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  username: string;
  user_id: number;
}

export default function PhotoDetails() {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?.id || null;

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/photos/${id}/details`);
      setPhoto(res.data.photo);
      setComments(res.data.comments);
      setError(null);
    } catch (err) {
      setError('Ошибка загрузки данных фото');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await api.post(`/photos/${id}/comments`, { content: commentText });
      setCommentText('');
      fetchDetails();
    } catch {
      alert('Ошибка при добавлении комментария');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот комментарий?')) return;

    try {
      await api.delete(`/photos/comments/${commentId}`);
      fetchDetails();
    } catch {
      alert('Ошибка при удалении комментария');
    }
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;
  if (!photo) return <p>Фото не найдено</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl text-center font-bold mb-4">{photo.title}</h1>
      
      <img
        src={`http://localhost:5000${photo.url}`}
        alt={photo.title}
        className="w-full max-h-[600px] object-contain mb-2"
      />

      <p className="text-center text-gray-600 mb-6">
        Автор: <Link to={`/user/${photo.user_id}`} className="text-blue-600 hover:underline">@{photo.username}</Link>
      </p>

      <form onSubmit={handleAddComment} className="mb-6">
        <textarea
          className="w-full border rounded p-2 mb-2"
          rows={3}
          placeholder="Добавьте комментарий..."
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Отправить
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Комментарии</h2>
      {comments.length === 0 ? (
        <p>Комментариев пока нет.</p>
      ) : (
        <ul>
          {comments.map(c => (
            <li key={c.id} className="border-b py-2 flex justify-between items-start">
              <div>
                <p className="font-bold">{c.username}</p>
                <p>{c.content}</p>
                <p className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</p>
              </div>
              {c.user_id === userId && (
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  className="text-red-600 hover:underline ml-4"
                >
                  Удалить
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

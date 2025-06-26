"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, TrendingUp, X } from "lucide-react";
import api from "../../utils/api";

export default function ProgressPage() {
  const [progress, setProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProgress, setEditingProgress] = useState(null);
  const [formData, setFormData] = useState({
    userId: "",
    achievementId: "",
    progress: "INPROGRESS", // enum: INPROGRESS, BLOCKED, FINISHED
    currentStep: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [progressData, achievementsData] = await Promise.all([
        api.get("/progress"),
        api.get("/achievements"),
      ]);
      setProgress(progressData.data);
      setAchievements(achievementsData.data);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProgress) {
        await api.patch(`/progress/${editingProgress.id}`, formData);
      } else {
        await api.post("/progress", formData);
      }
      setShowModal(false);
      setEditingProgress(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  const handleEdit = (progressItem) => {
    setEditingProgress(progressItem);
    setFormData({
      userId: progressItem.userId || "",
      achievementId: progressItem.achievementId || "",
      progress: progressItem.progress || "INPROGRESS",
      currentStep: progressItem.currentStep || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Вы уверены, что хотите удалить эту запись прогресса?")) {
      try {
        await api.delete(`/progress/${id}`);
        loadData();
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      userId: "",
      achievementId: "",
      progress: "INPROGRESS",
      currentStep: 0,
    });
  };

  const getAchievementName = (achievementId) => {
    const achievement = achievements.find((a) => a.id === achievementId);
    return achievement
      ? achievement.title?.ru || achievement.title || "Без названия"
      : "Без названия";
  };

  const getProgressStatus = (progress) => {
    switch (progress) {
      case "FINISHED":
        return { text: "Завершено", color: "bg-green-100 text-green-800" };
      case "BLOCKED":
        return { text: "Заблокировано", color: "bg-red-100 text-red-800" };
      case "INPROGRESS":
      default:
        return { text: "В процессе", color: "bg-yellow-100 text-yellow-800" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указано";
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Прогресс пользователей</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Добавить прогресс
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Достижение
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Текущий шаг
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата создания
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {progress.map((progressItem) => {
              const status = getProgressStatus(progressItem.progress);
              return (
                <tr key={progressItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {progressItem.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getAchievementName(progressItem.achievementId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}
                    >
                      {status.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {progressItem.currentStep || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(progressItem.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(progressItem)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(progressItem.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Улучшенное модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProgress
                    ? "Редактировать прогресс"
                    : "Добавить прогресс"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingProgress(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ID пользователя *
                  </label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) =>
                      setFormData({ ...formData, userId: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Введите ID пользователя"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Достижение *
                  </label>
                  <select
                    value={formData.achievementId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        achievementId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Выберите достижение</option>
                    {achievements.map((achievement) => (
                      <option key={achievement.id} value={achievement.id}>
                        {achievement.title?.ru ||
                          achievement.title ||
                          "Без названия"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Статус прогресса *
                </label>
                <select
                  value={formData.progress}
                  onChange={(e) =>
                    setFormData({ ...formData, progress: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="INPROGRESS">В процессе</option>
                  <option value="BLOCKED">Заблокировано</option>
                  <option value="FINISHED">Завершено</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Текущий шаг
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.currentStep}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentStep: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Введите текущий шаг"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Номер текущего шага в достижении (опционально)
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProgress(null);
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
                >
                  {editingProgress ? "Сохранить изменения" : "Создать запись"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

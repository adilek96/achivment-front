"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, X } from "lucide-react";
import api from "../../utils/api";
import TranslationEditor from "../../components/TranslationEditor";

// Список поддерживаемых языков
const LANGS = ["ru", "en", "tr", "fr", "de", "ar", "gr"];

// Функция для нормализации переводов
function normalizeTranslations(translations) {
  if (typeof translations !== "object" || translations === null) {
    translations = {};
  }

  const result = {};
  LANGS.forEach((lang) => {
    result[lang] =
      typeof translations[lang] === "string" ? translations[lang] : "";
  });
  return result;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);

  // Отдельные состояния для каждого поля
  const [title, setTitle] = useState(normalizeTranslations({}));
  const [description, setDescription] = useState(normalizeTranslations({}));
  const [categoryId, setCategoryId] = useState("");
  const [icon, setIcon] = useState("");
  const [hidden, setHidden] = useState(false);
  const [target, setTarget] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [achievementsData, categoriesData] = await Promise.all([
        api.get("/achievements"),
        api.get("/categories"),
      ]);

      setAchievements(achievementsData.data);
      setCategories(categoriesData.data);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        categoryId,
        icon,
        hidden,
        target: target === "" ? null : Number(target),
      };

      if (editingAchievement) {
        await api.patch(`/achievements/${editingAchievement.id}`, payload);
      } else {
        await api.post("/achievements", payload);
      }
      setShowModal(false);
      setEditingAchievement(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setTitle(normalizeTranslations(achievement.title));
    setDescription(normalizeTranslations(achievement.description));
    setCategoryId(achievement.categoryId || "");
    setIcon(achievement.icon || "");
    setHidden(achievement.hidden || false);
    setTarget(
      achievement.target === null || achievement.target === undefined
        ? ""
        : String(achievement.target)
    );
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Вы уверены, что хотите удалить это достижение?")) {
      try {
        await api.delete(`/achievements/${id}`);
        loadData();
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  const resetForm = () => {
    setTitle(normalizeTranslations({}));
    setDescription(normalizeTranslations({}));
    setCategoryId("");
    setIcon("");
    setHidden(false);
    setTarget("");
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category
      ? category.name?.ru || category.name || "Без категории"
      : "Без категории";
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
        <h1 className="text-2xl font-bold">Достижения</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Добавить достижение
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Описание
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Иконка
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Скрытое
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Целевое значение
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {achievements.map((achievement) => (
              <tr key={achievement.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {achievement.title?.ru ||
                      achievement.title ||
                      "Без названия"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getCategoryName(achievement.categoryId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {achievement.description?.ru ||
                    achievement.description ||
                    "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {achievement.icon || "Нет"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {achievement.hidden ? "Да" : "Нет"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {achievement.target !== null &&
                  achievement.target !== undefined
                    ? achievement.target
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(achievement.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAchievement
                    ? "Редактировать достижение"
                    : "Добавить достижение"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingAchievement(null);
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
                    Название *
                  </label>
                  <TranslationEditor value={title} onChange={setTitle} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Категория
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Выберите категорию</option>
                    {categories.length === 0 ? (
                      <option value="" disabled>
                        Нет доступных категорий
                      </option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name?.ru || category.name || "Без названия"}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Описание
                </label>
                <TranslationEditor
                  value={description}
                  onChange={setDescription}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Иконка
                  </label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Название иконки (например: trophy, star, medal)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Скрытое достижение
                  </label>
                  <div className="flex items-center h-full">
                    <input
                      type="checkbox"
                      checked={hidden}
                      onChange={(e) => setHidden(e.target.checked)}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Скрытое</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Целевое значение
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Например: 10"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAchievement(null);
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  {editingAchievement
                    ? "Сохранить изменения"
                    : "Создать достижение"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

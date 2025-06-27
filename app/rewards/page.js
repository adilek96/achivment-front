"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Gift, X } from "lucide-react";
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

export default function RewardsPage() {
  const [rewards, setRewards] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState(null);

  // Отдельные состояния для каждого поля
  const [type, setType] = useState("badge");
  const [title, setTitle] = useState(normalizeTranslations({}));
  const [description, setDescription] = useState(normalizeTranslations({}));
  const [icon, setIcon] = useState("");
  const [isApplicable, setIsApplicable] = useState(false);
  const [details, setDetails] = useState("");
  const [achievementId, setAchievementId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rewardsData, achievementsData] = await Promise.all([
        api.get("/rewards"),
        api.get("/achievements"),
      ]);
      setRewards(rewardsData.data);
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
      const payload = {
        type,
        title,
        description,
        icon,
        isApplicable,
        details: details ? JSON.parse(details) : null,
        achievementId,
      };

      if (editingReward) {
        await api.patch(`/rewards/${editingReward.id}`, payload);
      } else {
        await api.post("/rewards", payload);
      }
      setShowModal(false);
      setEditingReward(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  const handleEdit = (reward) => {
    setEditingReward(reward);
    setType(reward.type || "badge");
    setTitle(normalizeTranslations(reward.title));
    setDescription(normalizeTranslations(reward.description));
    setIcon(reward.icon || "");
    setIsApplicable(reward.isApplicable || false);
    setDetails(reward.details ? JSON.stringify(reward.details, null, 2) : "");
    setAchievementId(reward.achievementId || "");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Вы уверены, что хотите удалить эту награду?")) {
      try {
        await api.delete(`/rewards/${id}`);
        loadData();
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  const resetForm = () => {
    setType("badge");
    setTitle(normalizeTranslations({}));
    setDescription(normalizeTranslations({}));
    setIcon("");
    setIsApplicable(false);
    setDetails("");
    setAchievementId("");
  };

  const getTypeLabel = (type) => {
    const types = {
      badge: "Значок",
      bonus_crypto: "Бонус криптовалюты",
      discount_commission: "Скидка комиссии",
      cat_accessories: "Аксессуары для кота",
      visual_effects: "Визуальные эффекты",
    };
    return types[type] || type;
  };

  const getAchievementTitle = (achievementId) => {
    const achievement = achievements.find((a) => a.id === achievementId);
    return achievement
      ? achievement.title?.ru || achievement.title || "Без названия"
      : "Без достижения";
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
        <h1 className="text-2xl font-bold">Награды</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Добавить награду
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
                Тип
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Описание
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Достижение
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Иконка
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Применимо
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rewards.map((reward) => (
              <tr key={reward.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reward.title?.ru || reward.title || "Без названия"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getTypeLabel(reward.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reward.description?.ru || reward.description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getAchievementTitle(reward.achievementId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reward.icon || "Нет"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {reward.isApplicable ? "Да" : "Нет"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(reward)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(reward.id)}
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
                  {editingReward ? "Редактировать награду" : "Добавить награду"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingReward(null);
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
                    Тип награды *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="badge">Значок</option>
                    <option value="bonus_crypto">Бонус криптовалюты</option>
                    <option value="discount_commission">Скидка комиссии</option>
                    <option value="cat_accessories">Аксессуары для кота</option>
                    <option value="visual_effects">Визуальные эффекты</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Достижение *
                  </label>
                  <select
                    value={achievementId}
                    onChange={(e) => setAchievementId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    &nbsp;
                  </label>
                  <div className="text-xs text-gray-500 mt-1">
                    Выберите достижение, к которому привязана награда
                  </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Название иконки (например: gift, star, medal)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Применимо
                  </label>
                  <div className="flex items-center h-full">
                    <input
                      type="checkbox"
                      checked={isApplicable}
                      onChange={(e) => setIsApplicable(e.target.checked)}
                      className="h-5 w-5 text-green-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Применимо
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    &nbsp;
                  </label>
                  <div className="text-xs text-gray-500 mt-1">
                    Может ли награда быть применена пользователем
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Детали (JSON)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                  rows="6"
                  placeholder='{"amount": 100, "currency": "USD", "expires": "2024-12-31"}'
                />
                <div className="text-xs text-gray-500 mt-1">
                  Дополнительные данные в формате JSON (например, сумма бонуса,
                  валюта, срок действия)
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingReward(null);
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  {editingReward ? "Сохранить изменения" : "Создать награду"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Folder, X } from "lucide-react";
import { categoriesAPI } from "../../utils/api";
import TranslationEditor from "../../components/TranslationEditor";

const LANGS = ["ru", "en", "tr", "fr", "de", "ar", "gr"];

function getFullNameObject(name) {
  const result = {};
  LANGS.forEach((lang) => {
    result[lang] = name?.[lang] || "";
  });
  return result;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [key, setKey] = useState("");
  const [name, setName] = useState(getFullNameObject({}));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, { key, name });
      } else {
        await categoriesAPI.create({ key, name });
      }
      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setKey(category.key || "");
    setName(getFullNameObject(category.name));
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Вы уверены, что хотите удалить эту категорию?")) {
      try {
        await categoriesAPI.delete(id);
        loadData();
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  };

  const resetForm = () => {
    setKey("");
    setName(getFullNameObject({}));
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
        <h1 className="text-2xl font-bold">Категории</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingCategory(null);
            resetForm();
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Добавить категорию
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-500">
                  <Folder size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {category.name?.ru || category.name || "Без названия"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ключ: {category.key || "Не указан"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Достижений:</span>
                <span className="text-gray-900">
                  {category.achievements?.length || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Улучшенное модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory
                    ? "Редактировать категорию"
                    : "Добавить категорию"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ключ категории *
                </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Например: beginner, advanced, expert"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Уникальный ключ для идентификации категории (только латинские
                  буквы, цифры и подчеркивания)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Название *
                </label>
                <TranslationEditor value={name} onChange={setName} />
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  {editingCategory
                    ? "Сохранить изменения"
                    : "Создать категорию"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

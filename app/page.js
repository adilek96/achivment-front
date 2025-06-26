"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Gift,
  Users,
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Star,
} from "lucide-react";
import { statsAPI } from "../utils/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    categories: 0,
    achievements: 0,
    rewards: 0,
    progress: 0,
    progressStats: { completed: 0, inProgress: 0, blocked: 0 },
    achievementStats: { hidden: 0, visible: 0 },
    rewardStats: { applicable: 0, total: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📊 Загружаем статистику...");

      const response = await statsAPI.getStats();
      console.log("📊 Статистика загружена:", response.data);
      setStats(response.data);
    } catch (error) {
      console.error("❌ Ошибка загрузки статистики:", error);
      setError("Не удалось загрузить статистику");

      // Устанавливаем значения по умолчанию при ошибке
      setStats({
        categories: 0,
        achievements: 0,
        rewards: 0,
        progress: 0,
        progressStats: { completed: 0, inProgress: 0, blocked: 0 },
        achievementStats: { hidden: 0, visible: 0 },
        rewardStats: { applicable: 0, total: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Всего достижений",
      value: stats.achievements,
      icon: Trophy,
      color: "bg-blue-500",
      textColor: "text-blue-500",
    },
    {
      title: "Всего наград",
      value: stats.rewards,
      icon: Gift,
      color: "bg-green-500",
      textColor: "text-green-500",
    },
    {
      title: "Категории",
      value: stats.categories,
      icon: BarChart3,
      color: "bg-orange-500",
      textColor: "text-orange-500",
    },
    {
      title: "Записи прогресса",
      value: stats.progress,
      icon: TrendingUp,
      color: "bg-purple-500",
      textColor: "text-purple-500",
    },
    {
      title: "Завершенные достижения",
      value: stats.progressStats?.completed || 0,
      icon: Target,
      color: "bg-yellow-500",
      textColor: "text-yellow-500",
    },
    {
      title: "Активные пользователи",
      value: stats.progressStats?.inProgress || 0,
      icon: Users,
      color: "bg-red-500",
      textColor: "text-red-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка статистики...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Ошибка загрузки
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={loadStats}
                className="text-sm text-red-800 hover:text-red-900 font-medium"
              >
                Повторить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Панель управления
        </h1>
        <p className="text-gray-600">
          Добро пожаловать в админ-панель системы достижений
        </p>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <IconComponent size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Дополнительная статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Статистика достижений
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Видимые:</span>
              <span className="font-medium">
                {stats.achievementStats?.visible || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Скрытые:</span>
              <span className="font-medium">
                {stats.achievementStats?.hidden || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Статистика наград
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Применимые:</span>
              <span className="font-medium">
                {stats.rewardStats?.applicable || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Всего:</span>
              <span className="font-medium">
                {stats.rewardStats?.total || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Статистика прогресса
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Завершено:</span>
              <span className="font-medium text-green-600">
                {stats.progressStats?.completed || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">В процессе:</span>
              <span className="font-medium text-blue-600">
                {stats.progressStats?.inProgress || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Заблокировано:</span>
              <span className="font-medium text-red-600">
                {stats.progressStats?.blocked || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Информационные блоки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Быстрые действия */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star size={20} className="text-yellow-500" />
            Быстрые действия
          </h2>
          <div className="space-y-3">
            <a
              href="/categories"
              className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <BarChart3 size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-900">
                  Управление категориями
                </span>
              </div>
              <span className="text-orange-500">→</span>
            </a>

            <a
              href="/achievements"
              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Trophy size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-900">
                  Управление достижениями
                </span>
              </div>
              <span className="text-blue-500">→</span>
            </a>

            <a
              href="/rewards"
              className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Gift size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-900">
                  Управление наградами
                </span>
              </div>
              <span className="text-green-500">→</span>
            </a>

            <a
              href="/progress"
              className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <span className="font-medium text-gray-900">
                  Просмотр прогресса
                </span>
              </div>
              <span className="text-purple-500">→</span>
            </a>
          </div>
        </div>

        {/* Системная информация */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award size={20} className="text-blue-500" />
            Системная информация
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Версия API:</span>
              <span className="font-medium text-gray-900">v1.0.0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Статус базы данных:</span>
              <span className="font-medium text-green-600">Подключена</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Поддержка переводов:</span>
              <span className="font-medium text-green-600">Активна</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">CORS:</span>
              <span className="font-medium text-green-600">Настроен</span>
            </div>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">О системе достижений</h3>
        <p className="text-blue-100 mb-4">
          Система достижений позволяет создавать и управлять достижениями,
          наградами и отслеживать прогресс пользователей. Поддерживается
          многоязычность для названий и описаний.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Достижения</h4>
            <p className="text-blue-100">
              Создавайте различные типы достижений с настраиваемыми требованиями
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Награды</h4>
            <p className="text-blue-100">
              Система наград для мотивации пользователей
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Прогресс</h4>
            <p className="text-blue-100">
              Отслеживание прогресса пользователей по достижениям
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

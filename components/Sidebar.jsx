"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Trophy,
  Gift,
  BarChart3,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: "Дашборд",
      href: "/",
      icon: LayoutDashboard,
      color: "text-blue-600",
    },
    {
      name: "Категории",
      href: "/categories",
      icon: BarChart3,
      color: "text-orange-600",
    },
    {
      name: "Достижения",
      href: "/achievements",
      icon: Trophy,
      color: "text-blue-600",
    },
    {
      name: "Награды",
      href: "/rewards",
      icon: Gift,
      color: "text-green-600",
    },
    {
      name: "Прогресс",
      href: "/progress",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Мобильная кнопка */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Боковая панель */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Заголовок */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Админ-панель</h1>
          </div>

          {/* Навигация */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                    hover:bg-gray-100 hover:text-gray-900
                    ${item.color}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <IconComponent size={20} />
                  <span className="font-medium">{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Футер */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>Система достижений</p>
              <p className="mt-1">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Затемнение для мобильной версии */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

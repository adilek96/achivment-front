"use client";

import { useState } from "react";
import { Languages, Globe } from "lucide-react";

const LANGS = ["ru", "en", "tr", "fr", "de", "ar", "gr"];

function normalizeValue(val) {
  // Если строка — делаем объект только с ru
  if (typeof val !== "object" || val === null || Array.isArray(val)) {
    return { ru: String(val || "") };
  }

  const result = {};
  LANGS.forEach((lang) => {
    result[lang] = typeof val[lang] === "string" ? val[lang] : "";
  });
  return result;
}

export default function TranslationEditor({
  value = { ru: "", en: "", tr: "", fr: "", de: "", ar: "", gr: "" },
  onChange,
}) {
  const [activeTab, setActiveTab] = useState("ru");

  const safeValue = normalizeValue(value);

  const handleChange = (lang, text) => {
    const newValue = { ...safeValue, [lang]: text };
    onChange(newValue);
  };

  const languages = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "gr", name: "Ελληνικά", flag: "🇬🇷" },
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Вкладки языков */}
      <div className="flex bg-gray-50 border-b border-gray-300 overflow-x-auto">
        {languages.map((lang) => (
          <button
            type="button"
            key={lang.code}
            onClick={() => setActiveTab(lang.code)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 whitespace-nowrap
              ${
                activeTab === lang.code
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>

      {/* Поля ввода */}
      <div className="p-4">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={`transition-all duration-200 ${
              activeTab === lang.code ? "block" : "hidden"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Globe size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {lang.name}
              </span>
            </div>
            <textarea
              value={safeValue[lang.code] || ""}
              onChange={(e) => handleChange(lang.code, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder={`Введите текст на ${lang.name.toLowerCase()}...`}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {(safeValue[lang.code] || "").length} символов
              </span>
              {safeValue[lang.code] && (
                <span className="text-xs text-green-600 font-medium">
                  ✓ Заполнено
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Индикатор заполнения */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-300">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Languages size={16} className="text-gray-500" />
            <span className="text-gray-600">Заполнение переводов:</span>
          </div>
          <div className="flex gap-1">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={`w-3 h-3 rounded-full ${
                  safeValue[lang.code] && safeValue[lang.code].trim()
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
                title={`${lang.name}: ${
                  safeValue[lang.code] && safeValue[lang.code].trim()
                    ? "Заполнено"
                    : "Не заполнено"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Заполнено:{" "}
          {
            languages.filter(
              (lang) => safeValue[lang.code] && safeValue[lang.code].trim()
            ).length
          }{" "}
          из {languages.length} языков
        </div>
      </div>
    </div>
  );
}

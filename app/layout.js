import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "Админ-панель достижений",
  description: "Система управления достижениями и наградами",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 min-h-screen">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 lg:ml-64 min-h-screen">{children}</main>
        </div>
      </body>
    </html>
  );
}

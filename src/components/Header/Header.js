import React, { useEffect, useState } from "react";
import "./Header.css";
import { FaBars, FaGlobe, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const [loading, setLoading] = useState(true);
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Управление видимостью выпадающего списка
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [profinfo,setProfInfo] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token){
      setProfileVisible(true);
    const fetchinfo = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/get_my_info`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const status = await response.json();
          console.log(status)
          setProfInfo(status);
        } else {
          console.error("Failed to fetch info");
        }
      } catch (error) {
        console.error("Error fetching info:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchinfo();
  }}, []);

  // Функция для обработки нажатия на "Вийти"
  const handleLogout = () => {
    localStorage.removeItem("token"); // Удаляем токен из localStorage
    window.location.href = "/"; // Перенаправляем пользователя на страницу входа
  };

  // Рендер кнопок в зависимости от статуса
  return (
    <header className="header">
      <div className="header-buttons">
        <h1 className="header-buttonsp">Менеджер задач</h1>
        <h1 className="header-buttonsp" style={{Right: '0vw'}}>{profinfo[0]?.name}</h1>
        {profinfo[0]?.status === "admin" && (
          <a href="/admin" className="header-buttonsp">
            Admin panel
          </a>
        )}
</div>
          {isProfileVisible && (
        <div className="user-dropdown">
          <FaUserCircle
            className="styles-icon"
            onClick={() => setDropdownVisible((prev) => !prev)} // Переключение видимости меню
          />
          {isDropdownVisible && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => alert(`Ім'я = ${profinfo[0]?.name}
Телефон = ${profinfo[0]?.phone}
Статус = ${
  profinfo[0]?.status === "add" ? "Постановщик задач" :
  profinfo[0]?.status === "receive" ? "Отримувач задач" :
  profinfo[0]?.status === "add_and_receive" ? "Постановщик та отримувач задач" :
  "Admin"
}
`
              )}>
                Профіль
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Вийти
              </button>
            </div>
          )}
        </div>
        )}
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import "./Homepage.css";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import AddTasks from "../AddTasksPage/AddTasksPage"
import MyTasks from "../MyTasks/MyTasks"
import TasksAnalisBoss from "../TasksAnalisBoss/TaskAnalisBoss"
import TasksPage from "../TasksPage/TasksPage"

const HomePage = () => {
  const [status, setStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("MyTasks");
  const [phone, setPhone] = useState("+380");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
  });
  const [token, setToken] = useState(null); // Хранение токена
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем токен при монтировании компонента
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/get_status/${storedToken}`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const status = await response.json();
          
          if(status === 'admin'){
            navigate('/admin');
          }
          setStatus(status);
        } else {
          console.error("Failed to fetch status");
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, []);
  useEffect(() => {
    console.log(status)
    if(status){
      if(status === 'add'){
        setActiveTab('MyCreatedTasks')
      }
    }
    
  }, [status]);

  // Проверка валидности телефона
  const validatePhone = (phone) => /^\+380\d{9,}$/.test(phone);

  // Проверка валидности пароля
  const validatePassword = (password) =>
    password.length >= 6 && password.length <= 20;

  // Обработчик ввода телефона
  const handlePhoneChange = (e) => {
    const input = e.target.value;
    if (input.startsWith("+380")) {
      const newPhone = "+380" + input.slice(4).replace(/[^0-9]/g, "");
      setPhone(newPhone);
    } else {
      setPhone("+380");
    }
    setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
  };

  // Обработчик ввода пароля
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
  };

  // Обработчик выхода
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "AddTasks":
        return <AddTasks />;
      case "MyTasks":
        return <MyTasks />;
      case "TasksHistory":
        return <div style={{marginRight:'5em', marginTop: '5em'}}>Буде історія завдань та аналіз</div>
        case "TasksHistory2":
        return <TasksAnalisBoss />;
      case "MyCreatedTasks":
        return <TasksPage />;
      default:
        return null;
    }
  };

  // Обработчик отправки формы
  const handleLogin = async (e) => {
    e.preventDefault();

    let phoneError = "";
    let passwordError = "";

    if (!validatePhone(phone)) {
      phoneError =
        "Номер телефону повинен починатися з +380 і містити мінімум 9 цифр.";
    }

    if (!validatePassword(password)) {
      passwordError = "Пароль повинен бути від 6 до 20 символів.";
    }

    if (phoneError || passwordError) {
      setErrors({
        phone: phoneError,
        password: passwordError,
      });
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Network error");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
      window.location.reload();
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
  };

  return (
    <div className="login-container-main">
      <Header />
      {token ? (
            <><div className="sidebar2">
          {(status === 'add' || status === 'add_and_receive') && (
          <button onClick={() => setActiveTab("MyCreatedTasks")}
            className={activeTab === "MyCreatedTasks" ? "active" : ""}
          >
            Задачі на виконання
          </button> )}
          {(status === 'receive' || status === 'add_and_receive') && (
          <button onClick={() => setActiveTab("MyTasks")}
            className={activeTab === "MyTasks" ? "active" : ""}
          >
            Мої задачі
          </button>)}
          {(status === 'receive' || status === 'add_and_receive') && (
          <button onClick={() => setActiveTab("TasksHistory")}
            className={activeTab === "TasksHistory" ? "active" : ""}
          >
            Історія моїх задач
          </button>)}
          {(status === 'add' || status === 'add_and_receive') && (
          <button onClick={() => setActiveTab("TasksHistory2")}
            className={activeTab === "TasksHistory2" ? "active" : ""}
          >
            Історія задач на виконання
          </button>)}
        </div><div className="content-area2">{renderContent()}</div></>
      ) : (
        // Отображение формы авторизации
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Увійти</h2>

            <div className="input-group">
              <label htmlFor="phone">Номер телефону</label>
              <input
                id="phone"
                type="tel"
                placeholder="Уведіть номер телефону"
                value={phone}
                onChange={handlePhoneChange}
                required
              />
              {errors.phone && <div className="error">{errors.phone}</div>}
            </div>

            <div className="input-group">
              <label htmlFor="password">Пароль</label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Уведіть пароль"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Скрити" : "Показати"}
                </button>
              </div>
              {errors.password && <div className="error">{errors.password}</div>}
            </div>

            <button type="submit" className="login-button">
              Авторизуватися
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;

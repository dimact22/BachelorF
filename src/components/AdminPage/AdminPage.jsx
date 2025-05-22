import React, { useState, useEffect } from "react";
import "./AdminPage.css";
import Select from "react-select";
import Header from "../Header/Header";
import plus from "../../plus.png"
import deleter from "../../delete.png"
import changer from "../../change.png"
import door from "../../door.png"

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("viewUsers"); // Выбранная вкладка
  const [users, setUsers] = useState([]); // Состояние для хранения списка пользователей
  const [token, setToken] = useState(""); // Токен для авторизации
  const [usersToAdd, setUsersToAdd] = useState([]); // Список пользователей для добавления
  const [usersForGroup, setUsersForGroup] = useState([]); // Список пользователей для выбора в группу

  // Получение токена и проверка доступа
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("У вас немає прав на користування цією сторінкою");
      window.location.href = "/";
      return;
    }
    setToken(token);
  }, []);

  // Функция для получения списка пользователей
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/get_users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data); // Сохраняем пользователей в состоянии
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUsersToAdd = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/get_users_add`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users to add");
      }
      const data = await response.json();
      setUsersToAdd(data);
    } catch (error) {
      console.error("Error fetching users to add:", error);
    }
  };

  // Загружаем пользователей для создания группы
  const fetchUsersForGroup = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/get_users_receive`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users for group");
      }
      const data = await response.json();
      setUsersForGroup(data);
    } catch (error) {
      console.error("Error fetching users for group:", error);
    }
  };

  // Загружаем пользователей при монтировании компонента
  useEffect(() => {
    if (token) {
      fetchUsers(); // Загружаем пользователей только при наличии токена
      fetchUsersToAdd();
      fetchUsersForGroup();
    }
  }, [token]); // Зависимость от токена

  useEffect(() => {
    if (token) {
      fetchUsersToAdd();
      fetchUsersForGroup();
    }
  }, [users]); // Зависимость от токена

  // Рендерим соответствующий контент в зависимости от активной вкладки
  const renderContent = () => {
    switch (activeTab) {
      case "createUser":
        return <CreateUserForm fetchUsers={fetchUsers} fetchUsersToAdd={fetchUsersToAdd} token={token} />;
      case "viewUsers":
        return <UserTable token={token} users={users} fetchUsers={fetchUsers} fetchUsersForGroup={fetchUsersForGroup} fetchUsersToAdd={fetchUsersToAdd}/>;
      case "createGroup":
        return <CreateGroupForm token={token} fetchUsersForGroup={fetchUsersForGroup} usersToAdd={usersToAdd} usersForGroup={usersForGroup} />;
      case "viewGroup":
        return <ViewGroups token={token} usersToAdd={usersToAdd} usersForGroup={usersForGroup} />;
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="sidebar">
        <button onClick={() => setActiveTab("viewUsers")}
          className={activeTab === "viewUsers" ? "active" : ""}
          >
          Користувачі
        </button>
        <button onClick={() => setActiveTab("viewGroup")}
          className={activeTab === "viewGroup" ? "active" : ""}
          >
          Групи користувачів
        </button>
      </div>
      <div className="content-area">{renderContent()}</div>
    </div>
  );
};

const CreateUserForm = ({ fetchUsers, fetchUsersToAdd, token, onClose }) => {
    console.log("CreateUserForm получил props:", { fetchUsers, fetchUsersToAdd, token });
    
    const [phone, setPhone] = useState("+380");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState("add");
    const [name, setName] = useState("");
    const [telegramName, setTelegramName] = useState("");  // Новое состояние для Telegram имени
    const [errors, setErrors] = useState({
      phone: "",
      password: "",
      name: "",
      telegramName: "",  // Ошибки для Telegram имени
    });
  
    const validatePhone = (phone) => /^\+380\d{9,}$/.test(phone);
    const validatePassword = (password) => password.length >= 6 && password.length <= 20;
    const validateTelegramName = (telegramName) => telegramName.length >= 5 && telegramName.startsWith('@');
  
    const handleCreateUser = async (e) => {
      e.preventDefault();
      let phoneError = "";
      let passwordError = "";
      let nameError = "";
      let telegramNameError = "";
  
      if (!validatePhone(phone)) {
        phoneError = "Номер телефону повинен починатися з +380 і містити мінімум 9 цифр.";
      }
      if (!validatePassword(password)) {
        passwordError = "Пароль повинен бути від 6 до 20 символів.";
      }
      if (!validateTelegramName(telegramName)) {  // Если Telegram имя заполнено, проверяем его
        telegramNameError = "Телеграм ім'я повинно починатися з @ та мінімум 5 символів.";
      }
      if (phoneError || passwordError || telegramNameError) {
        setErrors({
          phone: phoneError,
          password: passwordError,
          name: nameError,
          telegramName: telegramNameError,  // Добавляем ошибку для Telegram имени
        });
        return;
      }
  
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/register/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ phone, password, status, name, telegramName }),  // Добавляем telegramName в запрос
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Network error");
        }
        await fetchUsers();
        await fetchUsersToAdd();
        setPhone("+380");
        setPassword("");
        setStatus("add");
        setName("");
        setTelegramName("");  // Сбросить поле Telegram имени
        alert("Користувача успішно створено!");
        onClose(); // Закрыть модальное окно
      } catch (error) {
        alert("Error creating user: " + error.message);
      }
    };
  
    return (
      <div className="modal-overlay4">
        <div className="modal-content4">
          <button type="button" style={{ marginTop: '0vw', width: '5%', marginLeft: '95%' }} onClick={onClose}>X</button>
          <form className="registration-form" onSubmit={handleCreateUser}>
            <div className="form-group">
              <label htmlFor="name">Ім'я та Прізвище:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Телефон:</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <div className="error">{errors.phone}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль:</label>
              <div className="password-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="toggle-password2"
                >
                  {showPassword ? "Сховати" : "Показати"}
                </button>
              </div>
              {errors.password && <div className="error">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="status">Статус:</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="add">Постановщик задач</option>
                <option value="receive">Отримувач задач</option>
                <option value="add_and_receive">Постановщик та отримувач задач</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="telegramName">Телеграм ім'я:</label>
              <input
                type="text"
                id="telegramName"
                value={telegramName}
                onChange={(e) => setTelegramName(e.target.value)}
              />
              {errors.telegramName && <div className="error">{errors.telegramName}</div>}
            </div>
            <button type="submit" className="create-button">Створити</button>
          </form>
        </div>
      </div>
    );
};

const ViewGroups = ({ token, usersToAdd, usersForGroup }) => {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupStatus, setGroupStatus] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isCreategroupModalOpen, setIsCreategroupModalOpen] = useState(false);
  const customStyles = {
    control: (base) => ({
      ...base,
      marginTop: "0.5em",
    }),
  };

  const handleCreateGroupButtonClick = () => {
    setIsCreategroupModalOpen(true); // Открыть модальное окно для создания нового пользователя
  };

  const handleCloseGroupUserModal = () => {
    setIsCreategroupModalOpen(false); // Закрыть модальное окно для создания пользователя
  };

  const userOptions = usersForGroup.map((user) => ({
    value: user.phone,
    label: `${user.phone}, ${user.name}`,
  }));

  const userOptions2 = usersToAdd.map((user) => ({
    value: user.phone,
    label: `${user.phone}, ${user.name}`,
  }));
  const handleSaveGroup = async () => {
    setIsCreategroupModalOpen(false);
    if (!selectedManager || selectedUsers.length === 0) {
      alert("Будь ласка, виберіть керівника та користувачів.");
      return;
    }
    console.log(groupStatus);
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/edit_group/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          group_name: groupToEdit.group_name, // Имя группы не меняем
          manager_phone: selectedManager,
          user_phones: selectedUsers,
          active: groupStatus, // Сохраняем новый статус группы
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update group");
      }

      await fetchGroups(); // Перезагружаем список групп
      alert("Групу успішно оновлено!");
      setIsModalOpen(false); // Закрываем модальное окно
      setSelectedGroup(null);
    } catch (error) {
      alert("Error updating group: " + error.message);
    }
  };
  const fetchGroups = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/get_groups/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };
  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setGroupToEdit(null);
  };
  const handleManagerSelect = (e) => {
    setSelectedManager(e.value);
  };

  // Функция для изменения выбранных пользователей
  const handleUserSelect = (selectedOptions) => {
    setSelectedUsers(selectedOptions.map((option) => option.value));
  };

  // Функция для изменения статуса группы (активен или неактивен)
  const handleStatusChange = (status) => {
    setGroupStatus(status);
  };

  const handleEditGroup = () => {
    if (!selectedGroup) return;

    setGroupToEdit(selectedGroup);
    setSelectedManager(selectedGroup.manager_phone);
    setSelectedUsers(selectedGroup.user_phones || []);
    setGroupStatus(selectedGroup.active);
    setIsModalOpen(true);
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    const groupName = selectedGroup.group_name;

    if (!window.confirm(`Ви впевнені, що хочете видалити групу "${groupName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/delete_group/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ group_name: groupName }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete group");
      }
      await fetchGroups();
      alert(`Групу "${groupName}" успішно видалено.`);
      setSelectedGroup(null);
    } catch (error) {
      alert("Error deleting group: " + error.message);
    }
  };

  const handleCancelSelection = () => {
    setSelectedGroup(null);
  };

  useEffect(() => {
    if (token) {
      fetchGroups();
    }
  }, [token]);

  return (
    <div className="group-table">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
      <img className="createuser-button" onClick={handleCreateGroupButtonClick} src={plus} style={{width:'125px', height:'100px'}} ></img>
      </div>
      <table style={{marginTop: "0vw"}}>
        <thead>
          <tr>
            <th>Назва</th>
            <th>Лідер групи</th>
            <th>Користувачі групи</th>
            <th>Активний</th>
          </tr>
        </thead>
        <tbody>
  {groups.length === 0 ? (
    <tr>
      <td colSpan="4" style={{ textAlign: "center" }}>
        Немає груп
      </td>
    </tr>
  ) : (
    groups.map((group, index) => (
      <tr
        key={index}
        onClick={() => setSelectedGroup(group)}
        className={selectedGroup === group ? "selectedgroup" : ""}
      >
        <td>{group.group_name}</td>
        <td>{group.manager_phone}</td>
        <td>
          {group.user_phones && group.user_phones.length > 0 ? (
            group.user_phones.join(", ")
          ) : (
            <em>Немає користувачів</em>
          )}
        </td>
        <td>{group.active ? "Так" : "Ні"}</td>
      </tr>
    ))
  )}
</tbody>
      </table>

      {selectedGroup && (
        <div className="action-popup">
          <img onClick={handleCancelSelection} style = {{height: "4vw", width: '4.5vw', marginRight: '13%', cursor:'pointer',marginLeft: '3vw'}} src = {door}></img>
          <img onClick={handleDeleteGroup} style = {{height: "4vw", width: '4.5vw', marginRight: '12%', cursor:'pointer'}} src = {deleter}></img>
          <img onClick={handleEditGroup}style = {{height: "4.7vw", width: '4.5vw', marginTop: '0.3vw', cursor:'pointer'}} src = {changer}></img>
        </div>
      )}

{isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Редагування групи</h2>
            <div className="form-group">
              <label htmlFor="groupName">Назва групи:</label>
              <input
                type="text"
                id="groupName"
                value={groupToEdit.group_name}
                style = {{marginTop: '0.5em'}}
                disabled
                className="input-group-name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="manager" style = {{marginBottom: '0.5em'}}>Керівник:</label>
              <Select
                id="manager"
                
                options={userOptions2}
                value={userOptions2.find((option) => option.value === selectedManager)}
                onChange={handleManagerSelect}
                placeholder="Оберіть керівника"
              />
            </div>
            <div className="form-group">
              <label htmlFor="users" style = {{marginBottom: '0.5em'}}>Користувачі:</label>
              <Select
                id="users"
                options={userOptions}
                value={userOptions.filter((option) => selectedUsers.includes(option.value))}
                onChange={handleUserSelect}
                isMulti
                placeholder="Виберіть користувачів"
              />
            </div>
            <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center' }}>
  <label style={{ marginRight: '10px', marginTop: '-25px' }}>Статус групи:</label>

  <div style={{ marginRight: '20px' }}>
    <label>
      <input
        type="radio"
        name="groupStatus"
        value="1"
        checked={groupStatus === 1}
        onChange={() => handleStatusChange(1)}
      />
      Активна
    </label>
  </div>

  <div>
    <label>
      <input
        type="radio"
        name="groupStatus"
        value="0"
        checked={groupStatus === 0}
        onChange={() => handleStatusChange(0)}
      />
      Неактивна
    </label>
  </div>
</div>
            </div>
            <div className="button-container">
            <button className="cancel-button" onClick={handleCancelEdit} style={{color: 'white'}}>Відміна</button>
            <button className="save-button" onClick={handleSaveGroup} style={{color: 'white'}}>Зберегти</button>
          </div></div>
        </div>
      )}
      {isCreategroupModalOpen && (
        <CreateGroupForm token={token} fetchGroups = {fetchGroups} usersToAdd={usersToAdd} usersForGroup={usersForGroup} onClose={handleCloseGroupUserModal} />
      )}
    </div>
  );
};

const UserTable = ({ users, token, fetchUsers, fetchUsersToAdd, fetchUsersForGroup }) => {
  const [editingUser, setEditingUser] = useState(null); // Для редактирования
  const [selectedUser, setSelectedUser] = useState(null); // Выбранный пользователь для popup
  const [isModalOpen, setIsModalOpen] = useState(false); // Для модального окна
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [telegramName, settelegramName] = useState("");  // Новое состояние для Телеграм-имени
  const [status, setStatus] = useState("add");
  const [NError, setNError] = useState(""); // Ошибка имени
  const [PError, setPError] = useState(""); // Ошибка пароля
  const [TError, setTError] = useState(""); // Ошибка Телеграм-имени
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const validatePassword = (password) => password.length >= 6 && password.length <= 20;
  const validateName = (name) => name.length >= 2;
  const validatetelegramName = (telegramName) => telegramName.length >= 5 && telegramName.startsWith('@');  // Валидация для Телеграм-имени

  const handleCreateUserButtonClick = () => {
    setIsCreateUserModalOpen(true); // Открыть модальное окно для создания нового пользователя
  };

  const handleCloseCreateUserModal = () => {
    setIsCreateUserModalOpen(false); // Закрыть модальное окно для создания пользователя
  };

  const handleDeleteUser = async (userId, phone) => {
    if (!window.confirm("Ви впевнені, що хочете видалити користувача?")) {
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/delete_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: userId, phone: phone }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      await fetchUsers();
      alert("Користувача видалено успішно");
      setSelectedUser(null); // Очистка выбранного пользователя
    } catch (error) {
      alert("Error deleting user: " + error.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setName(user.name);
    setStatus(user.status);
    settelegramName(user.telegramName); // Устанавливаем Телеграм-имя
    setIsModalOpen(true); // Открытие модального окна
  };

  const handleSaveUser = async () => {
    setPError('');
    setNError('');
    setTError('');
    if(!validateName(name)){
      setNError("Ім'я повинно бути більше 2 символів");
      return ;
    }
    if(pass.length>=1){
      if(!validatePassword(pass)){
        setPError('Пароль повинен бути від 7 до 20 символів');
        return ;
      }
    }
    if (!validatetelegramName(telegramName)) {  // Проверка на Телеграм-имя
      setTError("Телеграм ім'я повинно починатися з @ та мінімум 5 символів.");
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/edit_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingUser._id,
          name,
          status,
          password: pass,
          telegramName, // Добавляем Телеграм-имя
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }
      await fetchUsers();
      alert("Дані користувача успішно оновлені!");
      setIsModalOpen(false);
      setEditingUser(null);
      setSelectedUser(null);
      setPass('');
      settelegramName('');  // Очистка поля Телеграм
    } catch (error) {
      alert("Error saving user: " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleRowSelect = (user) => {
    setSelectedUser(user);
  };

  const handleCancelSelection = () => {
    setSelectedUser(null);
  };

  return (
    <div className="group-table" style={{marginRight: '2em',marginLeft: '-0.5vw'}}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <img className="createuser-button" onClick={handleCreateUserButtonClick} src={plus} style={{width:'125px', height:'100px'}} />
      </div>
      <div className="user-table" style={{marginTop: "0vw"}}>
        <table>
          <thead>
            <tr>
              <th>Ім'я та Прізвище</th>
              <th>Телефон</th>
              <th>Статус</th>
              <th>Телеграм name</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Користувачів немає
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  onClick={() => handleRowSelect(user)}
                  className={selectedUser?._id === user._id ? "selectedgroup" : ""}
                >
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>
                    {user.status === "add" && "Постановщик задач"}
                    {user.status === "receive" && "Отримувач задач"}
                    {user.status === "add_and_receive" && "Постановщик та отримувач задач"}
                  </td>
                  <td>{user.telegramName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Popup для кнопок */}
      {selectedUser && (
        <div className="action-popup">
          <img onClick={handleCancelSelection} style={{height: "4vw", width: '4.5vw', marginRight: '13%', cursor:'pointer', marginLeft: '3vw'}} src={door}></img>
          <img onClick={() => handleDeleteUser(selectedUser._id, selectedUser.phone)} style={{height: "4vw", width: '4.5vw', marginRight: '12%', cursor:'pointer'}} src={deleter}></img>
          <img onClick={() => handleEditUser(selectedUser)} style={{height: "4.7vw", marginTop: '0.3vw', width: '4.5vw', cursor:'pointer'}} src={changer}></img>
        </div>
      )}

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Редагування користувача</h2>
            <div className="form-group">
              <label htmlFor="name">Ім'я та Прізвище:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {NError && <p style={{ color: "red" }}>{NError}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="status">Статус:</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="add">Постановщик задач</option>
                <option value="receive">Отримувач задач</option>
                <option value="add_and_receive">Постановщик та отримувач задач</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="telegramName">Телеграм ім'я:</label>
              <input
                type="text"
                id="telegramName"
                value={telegramName}
                onChange={(e) => settelegramName(e.target.value)}
              />
              {TError && <p style={{ color: "red" }}>{TError}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="name">Новий пароль:</label>
              <input
                type="text"
                id="name"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              {PError && <p style={{ color: "red" }}>{PError}</p>}
            </div>
            <div className="button-container">
              <button className="cancel-button" style={{color: 'white'}} onClick={handleCancelEdit}>
                Відміна
              </button>
              <button className="save-button" style={{color: 'white'}} onClick={handleSaveUser}>
                Зберегти
              </button>
            </div>
          </div>
        </div>
      )}
      {isCreateUserModalOpen && (
        <CreateUserForm 
          fetchUsers={fetchUsers}
          token={token}
          fetchUsersForGroup={fetchUsersForGroup}
          fetchUsersToAdd={fetchUsersToAdd}
          onClose={handleCloseCreateUserModal}
        />
      )}
    </div>
  );
};

const CreateGroupForm = ({ usersToAdd, usersForGroup,fetchGroups, token, onClose }) => {
  const userOptions = usersForGroup.map((user) => ({
    value: user.phone,
    label: `${user.phone}, ${user.name}`,
  }));
  const [usersForGroup2, setUsersForGroup2] = useState(userOptions);
  console.log(usersForGroup2);
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const customStyles = {
    control: (base) => ({
      ...base,
      marginTop: "0.5em", // Отступ сверху
    }),
  };

  const userOptions2 = usersToAdd.map((user) => ({
    value: user.phone,
    label: `${user.phone}, ${user.name}`,
  }));

  const handleManagerSelect = (e) => {
    setSelectedManager(e.value);
    setUsersForGroup2(userOptions.filter(user => user.value !== e.value));
  };

  const handleUserSelect = (selectedOptions) => {
    setSelectedUsers(selectedOptions.map((option) => option.value));
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
  };

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!selectedManager || selectedUsers.length === 0 || !groupName) {
      alert("Будь ласка, введіть назву групи, виберіть керівника та користувачів.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/create_group/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          group_name: groupName,
          manager_phone: selectedManager,
          user_phones: selectedUsers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }
      await fetchGroups();
      alert("Групу успішно створено!");
      setSelectedManager("");
      setSelectedUsers([]);
      setGroupName("");
      onClose();
    } catch (error) {
      alert("Error creating group: " + error.message);
    }
  };

  return (
    <div className="modal-overlay4">
      <div className="modal-content4">
      <button type="button" style = {{ width: '5%', marginLeft: '95%'}} onClick={onClose}>X</button>
    <form className="create-group-form-container" onSubmit={handleCreateGroup}>
      <div className="form-group-item">
        <label htmlFor="groupName" className="label-group-name">
          Назва:
        </label>
        <input
          id="groupName"
          type="text"
          style = {{marginTop: "0.5em"}}
          value={groupName}
          onChange={handleGroupNameChange}
          className="input-group-name"
          placeholder="Введіть назву групи"
        />
      </div>

      <div className="form-group-item">
        <label htmlFor="manager" className="label-manager">
        Лідер групи:
        </label>
        <Select
  id="manager"
  options={userOptions2}
  styles={customStyles}
  onChange={handleManagerSelect}
  placeholder="Оберіть керівника"
/>
      </div>

      <div className="form-group-item">
        <label htmlFor="users" className="label-users">
        Користувачі групи:
        </label>
        <Select
          id="users"
          options={usersForGroup2}
          onChange={handleUserSelect}
          styles={customStyles}
          isMulti
          placeholder="Введіть телефон або ім'я для пошуку"
        />
      </div>

      <button type="submit" className="create-button">
        Створити
      </button>
    </form></div></div>
  );
};

export default AdminPage;

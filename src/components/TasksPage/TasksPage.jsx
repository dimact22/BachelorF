import React, { useState, useEffect } from 'react';
import "./TasksPage.css";
import Green from "./pngwing.com.png";
import Red from "./pngwing.com (2).png";
import Yellow from "./pngwing.com (1).png";
import DatePicker from "react-datepicker";
import CreateTask from "../AddTasksPage/AddTasksPage"
import plus from "../../plus.png"
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css"; 
import "react-clock/dist/Clock.css";
import deleter from "../../delete.png";
import "react-datepicker/dist/react-datepicker.css";
import changer from "../../change.png"
import door from "../../door.png"
import more from "../../more.png"
import copyer from "../../copyer.png"


import "react-datepicker/dist/react-datepicker.css";
const EditTaskModal = ({ task, isOpen, onClose, onTaskUpdated }) => {
  const [taskDetails, setTaskDetails] = useState({ ...task });
  const [groups, setGroups] = useState(task.group);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("У вас немає прав на користування цією сторінкою");
        window.location.href = "/";
        return;
    }
    const fetchGroups = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/get_my_groups`, {
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
            setGroups(data || []);
        } catch (error) {
            console.error("Error fetching groups:", error);
            setGroups([]);
        } finally {
            setIsLoadingGroups(false);
        }
    };
    fetchGroups();
}, []);
const handleInputChange = (e) => {
  const { name, checked, value } = e.target;  // добавили извлечение checked для checkbox
  if (name === 'needphoto') {
      setTaskDetails((prevDetails) => ({
          ...prevDetails,
          needphoto: checked,  // установим булевое значение
      }));
  } else if(name === 'needcomment') {
      setTaskDetails((prevDetails) => ({
          ...prevDetails,
          needcomment: checked,  // установим булевое значение
      }));}
      else {
      setTaskDetails((prevDetails) => ({
          ...prevDetails,
          [name]: value,
      }));
  }
};
  const handleTimeStartChange = (newTime) => {
    setTaskDetails((prev) => ({
      ...prev,
      start_time: newTime,
    }));
  };
  const handleTimeFinishChange = (newTime) => {
    setTaskDetails((prev) => ({
      ...prev,
      end_time: newTime,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setTaskDetails((prevDetails) => {
      const updatedDays = checked
        ? [...prevDetails.repeat_days, value]
        : prevDetails.repeat_days.filter((day) => day !== value);
      return { ...prevDetails, repeat_days: updatedDays };
    });
  };
  const importanceOptions = [
    { value: "0", 
      label: "Не дуже важливо"
    },
    { value: "1", label: "Важливо" },
    { value: "2", label: "Дуже важливо" },
];

const daysOfWeek = [
  { value: "Monday", label: "Пн" },
  { value: "Tuesday", label: "Вт" },
  { value: "Wednesday", label: "Ср" },
  { value: "Thursday", label: "Чт" },
  { value: "Friday", label: "Пт" },
  { value: "Saturday", label: "Сб" },
  { value: "Sunday", label: "Нд" },
];

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const updatedTaskDetails = {
      ...taskDetails,
      taskid: taskDetails._id, // Копируем _id в taskid
  };
  delete updatedTaskDetails._id; // Удаляем старое поле _id

  console.log(updatedTaskDetails); // Проверяем данные перед отправкой

    fetch(`${process.env.REACT_APP_URL}/update_task/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedTaskDetails),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        alert("Задачу оновлено успішно");
        onTaskUpdated(updatedTask); // Оновлюємо задачу у списку
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        alert("Помилка при оновленні задачі");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay2" onClick={onClose}>
      <div className="modal-content2" onClick={(e) => e.stopPropagation()} style = {{paddingBottom: "8%"}}>
        <form onSubmit={handleSubmit}>
        <div className="task-form_addTask">
        <button className="modal-close-button2" style={{marginTop:'2.3em', marginRight: '2em'}} onClick={onClose}>✖️</button>
        <div className="form-row" style={{marginTop: '2vw'}}>
          <div className="form-group3_addTask">
            <label>Тип завдання</label>
            <select
              name="task_type"
              style={{width: "15em"}}
              value={taskDetails.task_type}
              onChange={handleInputChange}
              className="task-type-select_addTask"
            >
              <option value="general">Загальні</option>
              <option value="weekly">Щотижневі</option>
            </select>
          </div>
          <div className="form-group3_addTask">
          <label>Приоритет</label>
                        <select
                        name="importance"
                        style={{width: "15em"}}
                            value={taskDetails.importance}
                            onChange={handleInputChange}
                            className="task-type-select_addTask"
                        >
                            {importanceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
          </div></div>
          <div className="form-group3_addTask">
            <label>Назва</label>
            <input
              type="text"
              name="title"
              style={{width: "25em"}}
              value={taskDetails.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{width: "25em"}} className="form-group3_addTask">
                            <label>Оберіть групу</label>
                            {isLoadingGroups ? (
                                <p>Завантаження груп...</p>
                            ) : groups.length > 0 ? (
                                <select
                                    name="group"
                                    value={taskDetails.group}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Оберіть групу
                                    </option>
                                    {groups.map((group, index) => (
                                        <option key={index} value={group}>
                                            {group}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p>У вас немає груп для яких ви можете створити завдання</p>
                            )}
                        </div>
          {taskDetails.task_type === "weekly" && (
            <div className="form-group3_addTask">
              <label>Дні повторення</label>
              <div className="form-row">
              {daysOfWeek.map((day) => (
                <label key={day.value} className="checkbox-label_addTask">
                    <input
                      type="checkbox"
                      value={day.value}
                      checked={taskDetails.repeat_days.includes(day.value)}
                      onChange={handleCheckboxChange}
                    />
                    <span>{day.label}</span>
                  </label>
                )
              )}
            </div></div>
          )}
          <div className="form-row column_style">
          <div style={{marginTop: "1em"}} className="form-group3_addTask">
            <label>Дата початку</label>
            <input
              type="date"
              name="start_date"
              style={{width: "20em"}}
              value={taskDetails.start_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div style={{marginTop: "1em"}}  className="form-group3_addTask">
            <label>Дата закінчення</label>
            <input
              type="date"
              name="end_date"
              value={taskDetails.end_date}
              style={{width: "20em"}}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          </div>
          <div className="form-row column_style">
          <div style={{marginTop: "1em"}} className="form-group3time_addTask">
            <label>Час початку</label>
            <TimePicker
        id="start_time"
        name="start_time"
        value={taskDetails.start_time}
        onChange={handleTimeStartChange}
        style={{width: "20em"}}
        format="HH:mm" // Формат времени (24-часовой)
        required
        className="timecustomise"
      />
          </div>
          <div style={{marginTop: "1em"}} className="form-group3time_addTask">
            <label>Час закінчення</label>
            <TimePicker
        id="end_time"
        name="end_time"
        value={taskDetails.end_time}
        onChange={handleTimeFinishChange}
        style={{width: "20em"}}
        format="HH:mm" // Формат времени (24-часовой)
        required
        className="timecustomise"
      />
          </div>
          </div>
          <div className="form-group3_addTask">
            <label>Опис</label>
            <textarea
              name="description"
              value={taskDetails.description}
              onChange={handleInputChange}
              style={{width: '70%'}}
            />
          </div>
          <div className="form-row">
                        <div className = "checkboxaddtask" style={{ marginRight: '20vw', position: "relative" }}>
                            <label style={{ marginRight: "3px", display: "inline-block" }}>Потрібно фото: </label>
                            <input
        type="checkbox"
        name="needphoto"
        id="needphoto"
        checked={taskDetails.needphoto}
        className="checkbox-label_addTask2"
        onChange={handleInputChange}
        style={{
            position: "relative", // Относительное позиционирование
            top: "4px", // Двигает чекбокс вниз
            left: "0", // Можно регулировать положение по горизонтали, если потребуется
          }}
        
      />
                           
                        </div>
                        <div className = "checkboxaddtask" style ={{position: "relative" }}>
                            <label style={{ marginRight: "3px", display: "inline-block" }}>Потрібно коментар: </label>
                            <input
        type="checkbox"
        name="needcomment"
        id="needcomment"
        className="checkbox-label_addTask2"
        checked={taskDetails.needcomment}
        onChange={handleInputChange}
        style={{
            position: "relative", // Относительное позиционирование
            top: "4px", // Двигает чекбокс вниз
            left: "0", // Можно регулировать положение по горизонтали, если потребуется
          }}
      />
                           
                        </div></div>
          <button type="submit" className="save-button" style={{marginTop: '2em', marginBottom: '1em', width: '15em', fontSize: '1em'}}>Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CopyTaskModal = ({ task, isOpen, onClose, onTaskUpdated }) => {
  const { _id,created_by,created_name,dateToComplete,...restTask } = task; // Исключаем _id из task
  const [taskDetails, setTaskDetails] = useState({
    ...restTask, // Используем оставшиеся поля
    start_date: "", // Переопределяем startDate
    
    end_date: "", // Переопределяем endDate
    start_time: "00:00", // Переопределяем startTime
    end_time: "00:00", // Переопределяем endTime
      });
  const [groups, setGroups] = useState(task.group);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  useEffect(() => {
    console.log('sdf',taskDetails)
    const token = localStorage.getItem("token");
    if (!token) {
        alert("У вас немає прав на користування цією сторінкою");
        window.location.href = "/";
        return;
    }
    const fetchGroups = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/get_my_groups`, {
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
            setGroups(data || []);
        } catch (error) {
            console.error("Error fetching groups:", error);
            setGroups([]);
        } finally {
            setIsLoadingGroups(false);
        }
    };
    fetchGroups();
}, []);
const handleInputChange = (e) => {
  const { name, checked, value } = e.target;  // добавили извлечение checked для checkbox
  if (name === 'needphoto') {
      setTaskDetails((prevDetails) => ({
          ...prevDetails,
          needphoto: checked,  // установим булевое значение
      }));
  } else if(name === 'needcomment') {
      setTaskDetails((prevDetails) => ({
          ...prevDetails,
          needcomment: checked,  // установим булевое значение
      }));}
      else {
      setTaskDetails((prevDetails) => ({
          ...prevDetails,
          [name]: value,
      }));
  }
};
  const handleTimeStartChange = (newTime) => {
    setTaskDetails((prev) => ({
      ...prev,
      start_time: newTime,
    }));
  };
  const handleTimeFinishChange = (newTime) => {
    setTaskDetails((prev) => ({
      ...prev,
      end_time: newTime,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setTaskDetails((prevDetails) => {
      const updatedDays = checked
        ? [...prevDetails.repeat_days, value]
        : prevDetails.repeat_days.filter((day) => day !== value);
      return { ...prevDetails, repeat_days: updatedDays };
    });
  };
  const importanceOptions = [
    { value: "0", 
      label: "Не дуже важливо"
    },
    { value: "1", label: "Важливо" },
    { value: "2", label: "Дуже важливо" },
];

const daysOfWeek = [
  { value: "Monday", label: "Пн" },
  { value: "Tuesday", label: "Вт" },
  { value: "Wednesday", label: "Ср" },
  { value: "Thursday", label: "Чт" },
  { value: "Friday", label: "Пт" },
  { value: "Saturday", label: "Сб" },
  { value: "Sunday", label: "Нд" },
];

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const taskData = {
      title: taskDetails.title,
      description: taskDetails.description,
      taskType: taskDetails.task_type,
      startDate: taskDetails.start_date,
      endDate: taskDetails.end_date,
      repeatDays: taskDetails.repeat_days,
      startTime: taskDetails.start_time,
      endTime: taskDetails.end_time,
      group: taskDetails.group,
      importance: taskDetails.importance,
      needphoto: taskDetails.needphoto,
      needcomment: taskDetails.needcomment
  };
  console.log(taskData)
    fetch(`${process.env.REACT_APP_URL}/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        alert("Задачу скопійовано успішно");
        onTaskUpdated(updatedTask); // Оновлюємо задачу у списку
        onClose();
        //window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        alert("Помилка при копіюванні задачі");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay2" onClick={onClose}>
      <div className="modal-content2" onClick={(e) => e.stopPropagation()} style = {{paddingBottom: "8%"}}>
        <form onSubmit={handleSubmit}>
        <div className="task-form_addTask">
        <button className="modal-close-button2" style={{marginTop:'2.3em', marginRight: '2em'}} onClick={onClose}>✖️</button>
        <div className="form-row" style={{marginTop: '2vw'}}>
          <div className="form-group3_addTask">
            <label>Тип</label>
            <select
              name="task_type"
              style={{width: "15em"}}
              value={taskDetails.task_type}
              onChange={handleInputChange}
              className="task-type-select_addTask"
            >
              <option value="general">Загальні</option>
              <option value="weekly">Щотижневі</option>
            </select>
          </div>
          <div className="form-group3_addTask">
          <label>Приоритет</label>
                        <select
                        name="importance"
                        style={{width: "15em"}}
                            value={taskDetails.importance}
                            onChange={handleInputChange}
                            className="task-type-select_addTask"
                        >
                            {importanceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
          </div></div>
          <div className="form-group3_addTask">
            <label>Назва</label>
            <input
              type="text"
              name="title"
              style={{width: "25em"}}
              value={taskDetails.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{width: "25em"}} className="form-group3_addTask">
                            <label>Оберіть групу</label>
                            {isLoadingGroups ? (
                                <p>Завантаження груп...</p>
                            ) : groups.length > 0 ? (
                                <select
                                    name="group"
                                    value={taskDetails.group}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>
                                        Оберіть групу
                                    </option>
                                    {groups.map((group, index) => (
                                        <option key={index} value={group}>
                                            {group}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p>У вас немає груп для яких ви можете створити завдання</p>
                            )}
                        </div>
          {taskDetails.task_type === "weekly" && (
            <div className="form-group3_addTask">
              <label>Дні повторення</label>
              <div className="form-row">
              {daysOfWeek.map((day) => (
                <label key={day.value} className="checkbox-label_addTask">
                    <input
                      type="checkbox"
                      value={day.value}
                      checked={taskDetails.repeat_days.includes(day.value)}
                      onChange={handleCheckboxChange}
                    />
                    <span>{day.label}</span>
                  </label>
                )
              )}
            </div></div>
          )}
          <div className="form-row">
          <div style={{marginTop: "1em"}} className="form-group3_addTask">
            <label>Дата початку</label>
            <input
              type="date"
              name="start_date"
              style={{width: "20em"}}
              value={taskDetails.start_date}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div style={{marginTop: "1em"}}  className="form-group3_addTask">
            <label>Дата закінчення</label>
            <input
              type="date"
              name="end_date"
              value={taskDetails.end_date}
              style={{width: "20em"}}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          </div>
          <div className="form-row">
          <div style={{marginTop: "1em"}} className="form-group3time_addTask">
            <label>Час початку</label>
            <TimePicker
        id="start_time"
        name="start_time"
        value={taskDetails.start_time}
        onChange={handleTimeStartChange}
        style={{width: "20em"}}
        format="HH:mm" // Формат времени (24-часовой)
        required
        className="timecustomise"
      />
          </div>
          <div style={{marginTop: "1em"}} className="form-group3time_addTask">
            <label>Час закінчення</label>
            <TimePicker
        id="end_time"
        name="end_time"
        value={taskDetails.end_time}
        onChange={handleTimeFinishChange}
        style={{width: "20em"}}
        format="HH:mm" // Формат времени (24-часовой)
        required
        className="timecustomise"
      />
          </div>
          </div>
          <div className="form-group3_addTask">
            <label>Опис</label>
            <textarea
              name="description"
              value={taskDetails.description}
              onChange={handleInputChange}
              style={{width: '70%'}}
            />
          </div>
          <div className="form-row">
                        <div className = "checkboxaddtask" style={{ marginRight: '20vw', position: "relative" }}>
                            <label style={{ marginRight: "3px", display: "inline-block" }}>Потрібно фото: </label>
                            <input
        type="checkbox"
        name="needphoto"
        id="needphoto"
        checked={taskDetails.needphoto}
        className="checkbox-label_addTask2"
        onChange={handleInputChange}
        style={{
            position: "relative", // Относительное позиционирование
            top: "4px", // Двигает чекбокс вниз
            left: "0", // Можно регулировать положение по горизонтали, если потребуется
          }}
        
      />
                           
                        </div>
                        <div className = "checkboxaddtask" style ={{position: "relative" }}>
                            <label style={{ marginRight: "3px", display: "inline-block" }}>Потрібно коментар: </label>
                            <input
        type="checkbox"
        name="needcomment"
        id="needcomment"
        className="checkbox-label_addTask2"
        checked={taskDetails.needcomment}
        onChange={handleInputChange}
        style={{
            position: "relative", // Относительное позиционирование
            top: "4px", // Двигает чекбокс вниз
            left: "0", // Можно регулировать положение по горизонтали, если потребуется
          }}
      />
                           
                        </div></div>
          <button type="submit" className="save-button" style={{marginTop: '2em', marginBottom: '1em', width: '15em', fontSize: '1em'}}>Скопіювати</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TaskDetailModal = ({ task, isOpen, onClose }) => {
  if (!isOpen) return null;
  const daysOfWeek = [
    { value: "Понеділок", label: "Monday" },
    { value: "Вівторок", label: "Tuesday" },
    { value: "Середа", label: "Wednesday" },
    { value: "Четвер", label: "Thursday" },
    { value: "П'ятниця", label: "Friday" },
    { value: "Субота", label: "Saturday" },
    { value: "Неділя", label: "Sunday" },
];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style = {{paddingBottom: "5.5%"}}>
        <button className="modal-close-button2" onClick={onClose}>✖️</button>
        {task.description && task.description.length > 0 && (
          <div className="task-detail-item">
            <strong>Опис:</strong> <p>{task.description}</p>
          </div>
        )}
        {task.repeat_days && task.repeat_days.length > 0 && (
          <div className="task-detail-item">
            <strong>Повторення:</strong> <p>
      {task.repeat_days
        .map((day) => {
          const foundDay = daysOfWeek.find((d) => d.label === day);
          return foundDay ? foundDay.value : day; 
        })
        .join(', ')}
    </p>
          </div>
        )}
        <div className="task-detail-item">
          <strong>Дата початку:</strong> <p>{task.start_date} {task.start_time}</p>
        </div>
        <div className="task-detail-item">
          <strong>Дата кінця:</strong> <p>{task.end_date} {task.end_time}</p>
        </div>
        <div className="task-detail-item">
          <strong>Створенно:</strong> <p>{task.created_by}</p>
        </div>
        <div className="task-detail-item">
          <strong>Потрібно фото:</strong> <p>{task.needphoto === 1 ? 'Так' : 'Ні'}</p>
        </div>
        <div className="task-detail-item">
          <strong>Потрібно коментар:</strong> <p>{task.needcomment === 1 ? 'Так' : 'Ні'}</p>
        </div>
      </div>
    </div>
  );
};

const TaskItem = ({ task, onTaskUpdated, onTaskSelected, TaskSelected }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [procent, Setprocent] = useState('Не виявленно');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
    const toggleModal = () => {
      setIsModalOpen((prev) => !prev); // Toggle modal
    };
    const normalizeDate = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
    const dateObject = new Date(task.dateToComplete)
    dateObject.setHours(0, 0, 0, 0);
    console.log("=====", dateObject)
    useEffect(() => {
      fetch(`${process.env.REACT_APP_URL}/get_infoprocent_about_task/${task.group}/${task._id}`, {
        method: "GET"
      })
        .then((response) => response.json())
        .then((data) => {
          Setprocent(data);
        })
        .catch((error) => console.error('Помилка при отриманні завдань:', error));
    }, []);
    const handleCloseModal = () => {
      onTaskSelected(false); // Закрыть модальное окно для создания пользователя
    };
  
    // Функция для удаления задачи
    const handleDeleteTask = () => {
        if (!window.confirm(`Ви впевнені, що хочете видалити цю задачу "${task.title}"?`)) {
            return;
          }
      const token = localStorage.getItem("token");
      fetch(`${process.env.REACT_APP_URL}/delete_task/${task._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Помилка при видаленні завдання.");
          }
          alert("Завдання успішно видалено");
          window.location.reload(); // Обновляем страницу после удаления задачи
        })
        .catch((error) => {
          alert("Помилка при видаленні завдання: " + error.message);
        });
    };
  
    // Функция для редактирования задачи
    const handleEditTask = () => {
      // Для редактирования, можно добавить логику, например, открытие модального окна для редактирования
      alert("Редагування задачі ще не реалізовано.");
    };
  
    return (
      <>
        <tr
        onClick={() => onTaskSelected(task)}
        className={TaskSelected?._id === task._id ? "selectedgroup" : ""}>
        <td>
          <div style={{ marginTop: "8px", textAlign: "center" }}>
            <img
              src={task.importance === 0 ? Green : task.importance === 1 ? Yellow : Red}
              alt="Importance"
              style={{ width: "2em", verticalAlign: "middle", marginLeft: "0.2em" }}
            />
          </div>
        </td>
          <td>{task.dateToComplete.toLocaleDateString()
          } {task.end_time}</td>
          <td>{task.group}</td>
          <td style={{ maxWidth: '100%' }}>{task.title}</td>
          <td>{procent} %</td>
        </tr>
  
        {/* TaskDetailModal */}
        {isModalOpen && <TaskDetailModal task={task} isOpen={isModalOpen} onClose={toggleModal} />}
        {isEditModalOpen && (
        <EditTaskModal
          task={task}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onTaskUpdated={onTaskUpdated}
        />
      )}
      {isCopyModalOpen && (
        <CopyTaskModal
          task={task}
          isOpen={isCopyModalOpen}
          onClose={() => setIsCopyModalOpen(false)}
          onTaskUpdated={onTaskUpdated}
        />
      )}
      {TaskSelected == task && (
        <div className="action-popup" style = {{zIndex: '1002'}}>
          
          <img title="Вийти" onClick={handleCloseModal} style = {{height: "4.2vw", width: '4.5vw', marginRight: '13%', cursor:'pointer',marginLeft: '3vw'}} src = {door}></img>
          <img title="Деталі" onClick={toggleModal} style = {{height: "4vw", width: '4.5vw', cursor:'pointer', marginRight: '13%'}} src = {more}></img>
          <img title="Видалити" onClick={handleDeleteTask} style = {{height: "4vw", width: '4.5vw', marginRight: '12%', cursor:'pointer'}} src = {deleter}></img>
          <img title="Копіювати" onClick={() => setIsCopyModalOpen(true)} style = {{height: "3.5vw", width: '4.5vw', cursor:'pointer', marginRight: '13%'}} src = {copyer}></img>
          <img title="Редагувати" onClick={() => setIsEditModalOpen(true)} style = {{height: "4.2vw", width: '4.5vw', cursor:'pointer'}} src = {changer}></img>
        
        </div>
      )}
      </>
    );
  };

const TasksPage = () => {
  const getMidnightDate = () => {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    return midnight;
  };

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getMidnightDate());
  const [EndselectedDate, setEndSelectedDate] = useState(getMidnightDate());
  const [token, setToken] = useState('');
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const openCreateTaskModal = () => {
    setIsCreateTaskModalOpen(true);
  };

  const closeCreateTaskModal = () => {
    setIsCreateTaskModalOpen(false);
  };

  const filterTasksByDate = (startDate, endDate) => {
    console.log("Start:", startDate, "End:", endDate);
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Очищаем время у дат
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
  
    const filtered = tasks
    .filter((task) => {
      const taskStart = new Date(task.start_date);
      taskStart.setHours(0, 0, 0, 0);
      const taskEnd = new Date(task.end_date);
      taskEnd.setHours(0, 0, 0, 0);
      return taskStart <= end && taskEnd >= start;
    })
    .map((task) => {
      const taskEnd = new Date(task.end_date);
      return {
        ...task,
        dateToComplete: new Date(taskEnd.getFullYear(), taskEnd.getMonth(), taskEnd.getDate()),
      };
    });
  
    console.log("Filtered tasks:", filtered);
    setFilteredTasks(filtered);
  };

  

  useEffect(() => {
    // Получаем токен из localStorage
    const tokenFromStorage = localStorage.getItem("token");
    setToken(tokenFromStorage);

    // Если токен отсутствует, перенаправляем пользователя
    if (!tokenFromStorage) {
      alert("У вас немає прав на користування цією сторінкою");
      window.location.href = "/";
      return;
    }

    // Получаем задачи только если токен есть
    fetch(`${process.env.REACT_APP_URL}/get_my_created_task/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenFromStorage}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => console.error('Помилка при отриманні завдань:', error));
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      filterTasksByDate(selectedDate, EndselectedDate);
    }
  }, [selectedDate, EndselectedDate, tasks]);
  const clearTime = (date) => {
    // Устанавливаем время в 00:00:00 для заданной даты
    const clearedDate = new Date(date);
    clearedDate.setHours(0, 0, 0, 0); // Обрезаем время
    return clearedDate;
  };
  // Обработчик изменения даты
  const handleDateChange = (e) => {
    const selected = e.target.value; // Получаем строку вида "YYYY-MM-DD"
    const date = new Date(selected); // Преобразуем строку в объект Date
    if(clearTime(date) > clearTime(EndselectedDate)){
      alert('Дата початку не може бути більшою за дату кінця')
      return;
    }
    setSelectedDate(date); // Устанавливаем дату как объект Date
    
  };
  const handleDateChange2 = (e) => {
    const selected = e.target.value; // Получаем строку вида "YYYY-MM-DD"
    const date = new Date(selected); // Преобразуем строку в объект Date
    if(clearTime(date) < clearTime(selectedDate)){
      alert('Дата кінця не може бути меншою за дату початку')
      return;
    }
    setEndSelectedDate(date); // Устанавливаем дату как объект Date
    
  };
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  return (
    <div className="table-container">
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Календарь для выбора даты */}
      <div
        style={{
          marginTop: "5vw",
          marginBottom: "2em",
          textAlign: "center",
        }}
        className='column_style2'
      >
        <input
            type="date"
            name="startDate"
            value={formatDateForInput(selectedDate)} // Обновим формат для отображения (YYYY-MM-DD)
            onChange={handleDateChange}  // Обработчик изменения
            required
            className='datefirst'
          />
         <span className="date-separator">---</span>
          <input
            type="date"
            name="endDate"
            value={formatDateForInput(EndselectedDate)}
            onChange={handleDateChange2}  // Обработчик изменения
            required
            className='datesecond'
          />
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
      <img className="createuser-button" onClick={openCreateTaskModal} src={plus} style={{width:'125px', height:'100px'}} ></img>
      </div>
      <table className="task-list" style={{ marginBottom: selectedTask ? "10%" : "0" }}>
        <thead>
        <tr>
        <th>Приоритет</th>
    <th>Дедлайн</th>
    <th>Группа</th>
    <th style = {{width: "30%"}}>Назва</th>
    <th>Процент виконання</th>
  </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => <TaskItem task={task} onTaskUpdated={handleTaskUpdated} onTaskSelected={setSelectedTask} TaskSelected={selectedTask} />)
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>Завдань немає.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    {isCreateTaskModalOpen && (
        <div className="modal">
          <CreateTask onClose = {closeCreateTaskModal}/>
        </div>)}
    </div>
  );
};

export default TasksPage;

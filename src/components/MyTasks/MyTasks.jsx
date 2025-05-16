import React, { useState, useEffect } from 'react';
import "./MyTasks.css";
import Green from "./pngwing.com.png";
import Red from "./pngwing.com (2).png";
import Yellow from "./pngwing.com (1).png";
import DatePicker from "react-datepicker";
import door from "../../door.png"
import more from "../../more.png"


import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
const PhotoModal = ({ isOpen, onSubmit, onCancel, needphoto, setphotos }) => {
  const [photos, setPhotos] = useState([]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleRemove = (index) => {
    const updated = [...photos];
    URL.revokeObjectURL(updated[index].preview); // освобождение ресурсов
    updated.splice(index, 1);
    setPhotos(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (photos.length === 0 && needphoto === 1) {
      alert("Потрібно додати хоча б одне фото!");
      return;
    }
    setphotos(photos);
    onCancel();
    onSubmit();
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: "0.5em" }}>{needphoto === 0 ? "Фото" : "Фото*"}</h3>

        <div style={{ marginBottom: "1em" }}  className="photocontainer">
          <label className="upload-label">
            {photos.length === 0 ? "Завантажити фото" : "Завантажити ще"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {/* Список файлов */}
        <div className={photos.length === 0 ? "" : "photo-list"}>
          {photos.map((photo, index) => (
            <div key={index} className="photo-list-item">
              <a
                href={photo.preview}
                target="_blank"
                rel="noopener noreferrer"
                className="photo-link"
              >
                {photo.file.name}
              </a>
              <button onClick={() => handleRemove(index)} className="delete-button-inline">
                Видалити
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1em" }}>
          <button className="action-button cancel-button" onClick={onCancel}>
            Відмінити
          </button>
          <button className="action-button submit-button" onClick={handleSubmit}>
            Відправити
          </button>
        </div>
      </div>

      <style>{`
        .upload-label {
          display: inline-block;
          padding: 10px 15px;
          background-color: #4caf50;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        .photo-list {
          height: auto;
          max-height: 40vh;
          overflow-y: auto;
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 5px;
          background-color: #f9f9f9;
        }

        .photo-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }

        .photo-link {
          color: #007bff;
          text-decoration: underline;
          word-break: break-all;
        }

        .delete-button-inline {
          background-color: #e53935;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }

        .delete-button-inline:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </div>
  );
};


const CommentModal = ({ isOpen, onSubmit, onCancel, needcom }) => {
  const [comment, setComment] = useState("");

  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (needcom === 1 && !comment) {
      alert("Коментар є обов'язковим!");
      
    }else{
      onSubmit(comment)
    }
  }
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{marginBottom: '0.25em'}}>Коментар{needcom ===1?'*': ''}</h3>
        <textarea
          placeholder="Введіть свій коментар"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required={needcom === 1}
          style={{
            width: "100%",
            resize: 'none',
            height: "15em",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            marginBottom: "10px",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            className="action-button cancel-button"
            onClick={onCancel}
          >
            Відмінити
          </button>
          <button
            className="action-button submit-button"
            onClick={handleSubmit}
          >
            Відправити
          </button>
        </div>
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{paddingBottom: "5%"}}>
      <button className="modal-close-button2" style={{marginTop:'0.3vw', marginRight: '0vw'}} onClick={onClose}>✖️</button>
        {task.description && task.description.length > 0 && (
          <div className="task-detail-item">
            <strong>Опис:</strong> <p>{task.description}</p>
          </div>
        )}
        {task.repeat_days && task.repeat_days.length > 0 && (
          <div className="task-detail-item">
            <strong>Повторення:</strong> <p>{task.repeat_days
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
          <strong>Группа:</strong> <p>{task.group}</p>
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

const TaskItem = ({ task, selectedDate, onTaskSelected, TaskSelected, complTasks  }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [allowToRun, setAllowToRun] = useState(true);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isCommentModalOpen2, setIsCommentModalOpen2] = useState(false);
  const [buttonState, setButtonState] = useState("Почати завдання");
  const [isPause, setIsPause] = useState(0);
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev); // Toggle modal
  };
  const getKyivTime = () => new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kiev" });
  const getKyivDate = () => {
    const options = { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: "Europe/Kiev"
    };
    return new Date().toLocaleDateString("uk-UA", options).split('.').reverse().join('-');
  };
  const normalizeDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const savedTaskState = JSON.parse(localStorage.getItem("taskState"));
    if (savedTaskState && savedTaskState[task._id]) {
      setButtonState("Завершити завдання");
      setIsPause(savedTaskState[task._id].pause || 0);
    }
    compareDates2()
  }, []);

  const compareDates = () => {
    const today = new Date();
    
    const isSameDay = task.dateToComplete.getDate() === today.getDate() && 
    task.dateToComplete.getMonth() === today.getMonth() && 
    task.dateToComplete.getFullYear() === today.getFullYear();
  
    console.log(isSameDay);  
    return isSameDay;
  };
  const compareDates2 = () => {
    const now = new Date();

      // Время из БД: "13:12"
      const [hours, minutes] = task.start_time.split(":").map(Number);

      // Создаем объект времени из БД для сравнения
      const dbDate = new Date();
      dbDate.setHours(hours, minutes, 0, 0); // Устанавливаем часы, минуты, секунды, миллисекунды
      // Сравниваем
      if (now > dbDate) {
        return true;
      } else {
        return false;
      }
    };  
    const parseTime = (datetimeStr) => {
      
      const timePart = datetimeStr.split(', ')[1]; 
      return timePart;
    };
    
    const compareTimes = (t1, t2) => {
      const date1 = new Date(`1970-01-01T${t1}`);
      const date2 = new Date(`1970-01-01T${t2}`);
    
      if (date1 <= date2) return 1;
      if (date1 > date2) return 0;
    };
  const handleButtonPauseClick = () => {
    const currentTime = getKyivTime();
    const savedState = JSON.parse(localStorage.getItem("taskState")) || {};
    const pause = savedState[task._id] ? savedState[task._id].pause : 0
    if (pause === 0) {
      setIsPause(1);
      savedState[task._id].pause = 1;
      savedState[task._id].pause_start.push(currentTime);
      localStorage.setItem("taskState", JSON.stringify(savedState));
    }
    else {
      setIsPause(0);
      savedState[task._id].pause = 0;
      savedState[task._id].pause_end.push(currentTime);
      localStorage.setItem("taskState", JSON.stringify(savedState));
    }
  };
  const handleCloseModal = () => {
    onTaskSelected(false); // Закрыть модальное окно для создания пользователя
  };
  const handleFinishTask = async (comment) => {
    const currentTime = getKyivTime();
    const token = localStorage.getItem("token");
    const savedTaskState = JSON.parse(localStorage.getItem("taskState")) || {};
  
    if (savedTaskState[task._id]?.pause === 1) {
      alert("Перед завершенням завдання ви повинні завершити паузу");
      return;
    }
  
    const time1 = parseTime(currentTime);
  
    const formData = new FormData();
    formData.append("start_time", savedTaskState[task._id].start_time);
    formData.append("finish_time", currentTime);
    formData.append("pause_start", JSON.stringify(savedTaskState[task._id].pause_start));
    formData.append("pause_end", JSON.stringify(savedTaskState[task._id].pause_end));
    formData.append("id_task", task._id);
    formData.append("group", task.group);
    formData.append("task_name", task.title);
    formData.append("keyTime", task.key);
    formData.append("comment", comment || "");
    formData.append("in_time", compareTimes(time1, task.end_time));
  
    // Добавить фото
    photos.forEach((photo) => {
      formData.append("images", photo.file); // photo.file должен быть File объектом
    });
  
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/push_task`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}` // НЕ добавляй Content-Type, браузер сам установит
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update group");
      }

      delete savedTaskState[task._id];
      localStorage.setItem("taskState", JSON.stringify(savedTaskState));

      alert("Завдання завершенно, дякую");
      window.location.reload();
    } catch (error) {
      alert("Помилка при завершенні завдання: " + error.message);
    }
  };
  const submitcanceltask = async () => {
    if (!window.confirm(`Ви впевнені, що хочете відмінити це завдання?`)) {
      return;
    }
    setIsPhotoModalOpen(true);//setIsCommentModalOpen2(true);
  }
  const handleCancelTask = async (comment) => {
    const currentTime = getKyivTime();
    const token = localStorage.getItem("token");
    const savedTaskState = JSON.parse(localStorage.getItem("taskState")) || {};
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/cancel_task/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cancel_time: currentTime,
          id_task: task._id,
          comment, // Отправка комментария
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update group");
      }

      delete savedTaskState[task._id];
      localStorage.setItem("taskState", JSON.stringify(savedTaskState));

      alert("Завдання було відмінено");
      window.location.reload();
    } catch (error) {
      alert("Помилка при відміні завдання: " + error.message);
    }
  };

  const handleButtonClick = () => {
    if (buttonState === "Почати завдання") {
      const currentTime = getKyivTime();
      const savedTaskState = JSON.parse(localStorage.getItem("taskState")) || {};
      savedTaskState[task._id] = { start_time: currentTime, pause: 0, pause_start: [], pause_end: [] };
      localStorage.setItem("taskState", JSON.stringify(savedTaskState));
      setButtonState("Завершити завдання");
    } else {
      setIsPhotoModalOpen(true);//setIsCommentModalOpen(true); // Открыть окно с вводом комментария
    }
  };

  return (
    <>
      
        <>
          <tr
            className={`${task.isUrgent ? "task-item urgent" : "task-item"} ${
              TaskSelected?.key === task.key ? "selectedgroup" : ""
            }`}
            onClick={() => onTaskSelected(task)}
          >
            <td>
              <div style={{ marginTop: "8px", textAlign: "center" }}>
                <img
                  src={
                    task.importance === 0
                      ? Green
                      : task.importance === 1
                      ? Yellow
                      : Red
                  }
                  alt="Importance"
                  style={{ width: "2em", verticalAlign: "middle", marginLeft: "0.2em" }}
                />
              </div>
            </td>
            {compareDates() ? (
    <td>{task.end_time}</td> // Только время, если даты совпадают
  ) : (
    <td>{task.dateToComplete.toLocaleDateString()} {task.end_time}</td>
  )}
            <td>{task.created_name}</td>
            <td style={{ maxWidth: "100%" }}>{task.title} {allowToRun}</td>
          </tr>
  
          {TaskSelected === task && (
            <div className="action-popup" style={{ zIndex: "1002" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  paddingLeft: "20%",
                  paddingRight: "20%",
                }}
              >
                <img
                  title="Вийти"
                  onClick={handleCloseModal}
                  style={{
                    height: "4vw",
                    width: "4.5vw",
                    cursor: "pointer",
                  }}
                  src={door}
                ></img>
                <img
                  title="Деталі"
                  onClick={toggleModal}
                  style={{
                    height: "4.2vw",
                    width: "4.5vw",
                    cursor: "pointer",
                  }}
                  src={more}
                ></img>
                {compareDates() && compareDates2() && (
                  <>
                    {buttonState === "Завершити завдання" && (
                      <button
                        title="Почати/Завершити паузу"
                        style={{
                          fontSize: "3vw",
                          cursor: "pointer",
                          border: "none",
                          marginBottom: "0.5vw",
                        }}
                        onClick={handleButtonPauseClick}
                      >
                        {isPause === 0 ? "⏸️" : "▶️"}
                      </button>
                    )}
                    <button
                      title="Почати/Завершити задачу"
                      style={{
                        fontSize: "3.5vw",
                        cursor: "pointer",
                        border: "none",
                        marginBottom: "1vw",
                        backgroundColor: "transparent",
                      }}
                      onClick={handleButtonClick}
                    >
                      {buttonState === "Почати завдання" ? "📥" : "✔️"}
                    </button>
                    <button
                    title='Відмінити завдання'
                    style={{
                      fontSize: "3vw",
                      cursor: "pointer",
                      border: "none",
                      marginBottom: "0vw",
                      backgroundColor: "transparent",
                    }}
                    onClick={submitcanceltask}
                    >
❌
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
  
          {/* TaskDetailModal */}
          {isModalOpen && (
            <TaskDetailModal task={task} isOpen={isModalOpen} onClose={toggleModal} />
          )}
  
  {isCommentModalOpen2 && (
            <CommentModal
              isOpen={isCommentModalOpen2}
              needcom= {1}
              onSubmit={(comment) => {
                handleCancelTask(comment);
                setIsCommentModalOpen2(false); // Закрыть модальное окно
              }}
              onCancel={() => setIsCommentModalOpen2(false)} // Закрыть модальное окно без действия
            />
          )}
          {isPhotoModalOpen && (
            <PhotoModal
              isOpen={isPhotoModalOpen}
              needphoto={task.needphoto}
              setphotos = {setPhotos}
              onSubmit={() => {
                setIsCommentModalOpen(true); // Закрыть модальное окно
              }}
              onCancel={() => setIsPhotoModalOpen(false)} // Закрыть модальное окно без действия
            />
          )}
          {isCommentModalOpen && (
            <CommentModal
              isOpen={isCommentModalOpen}
              needcom={task.needcomment}
              onSubmit={(comment) => {
                handleFinishTask(comment);
                setIsCommentModalOpen(false); // Закрыть модальное окно
              }}
              onCancel={() => setIsCommentModalOpen(false)} // Закрыть модальное окно без действия
            />
          )}
        </>
    </>
  );}

const MyTasks = () => {
  const getMidnightDate = () => {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    return midnight;
  };
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [complTasks, setComplTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getMidnightDate());
  const [EndselectedDate, setEndSelectedDate] = useState(getMidnightDate());
  const [token, setToken] = useState('');
  const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const downloadFile = async (fileId) => {
    const response = await fetch(`${process.env.REACT_APP_URL}/download_file/${fileId}`, {
        method: "GET",
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "filename.jpg"; // Замените на название вашего файла
        a.click();
        window.URL.revokeObjectURL(url);
    } else {
        alert("Ошибка при скачивании файла");
    }
};
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const clearTime = (date) => {
    // Устанавливаем время в 00:00:00 для заданной даты
    const clearedDate = new Date(date);
    clearedDate.setHours(0, 0, 0, 0); // Обрезаем время
    return clearedDate;
  };
  const filterTasksByDate = (startDate, endDate) => {
    console.log("Start:", startDate, "End:", endDate);
  
    const allTasks = [];
  
    // Очищаем время начала и конца
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
  
    // Идём по всем датам между start и end
    for (
      let currentDate = new Date(start);
      currentDate <= end;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const date = new Date(currentDate); // копия, чтобы не повредить currentDate
  
      const dailyTasks = tasks
        .filter((task) => {
          const taskStartDate = new Date(task.start_date);
          taskStartDate.setHours(0, 0, 0, 0);
          const taskEndDate = new Date(task.end_date);
          taskEndDate.setHours(0, 0, 0, 0);
  
          return date >= taskStartDate && date <= taskEndDate;
        })
        .map((task) => ({
          ...task,
          dateToComplete: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        }));
  
      allTasks.push(...dailyTasks);
    }
  
    console.log("Filtered tasks:", allTasks);
    return allTasks;
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
    const day = String(selectedDate.getDate()).padStart(2, "0"); // День с ведущим нулем
const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Месяц (с поправкой, т.к. январь = 0)
const year = selectedDate.getFullYear(); // Год

const formattedDate = `${day}.${month}.${year}`;
    // Получаем задачи только если токен есть
    fetch(`${process.env.REACT_APP_URL}/get_my_task/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenFromStorage}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data.slice(0, -1));
        console.log("============----------===========", data.slice(0, -1))
        if (data.length > 0) {
          const lastTask = data[data.length - 1];
          setComplTasks([lastTask]); // Оборачиваем в массив, если `setTasks` принимает массив
        }
      })
      .catch((error) => console.error('Помилка при отриманні завдань:', error));
  }, []);
  
  useEffect(() => {
    const normalizeDate = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
    console.log(complTasks);
    const date_to_filter = normalizeDate(new Date()); // Текущая дата без времени
    const filteredTasks = filterTasksByDate(selectedDate, EndselectedDate);
    const checkTasks = () => {
      const CompTasks = complTasks.flat();
      const now = new Date(new Date().toLocaleString("en-US", {
        timeZone: 'Europe/Kiev',
        hour12: false, // Включаем 24-часовой формат времени
      }));
      // Текущее время в минутах с полуночи
      const nowInMinutes = now.getHours() * 60 + now.getMinutes();
      
  
      // Проходим по отфильтрованным задачам
      const tasksToUpdate = filteredTasks.map((task) => {
        
        const taskDateToComplete = normalizeDate(new Date(task.dateToComplete));
        
  
        // Проверяем, если `dateToComplete` совпадает с текущей датой
        if (taskDateToComplete.getTime() === date_to_filter.getTime()) {
          // Для времени окончания задачи
          const [endHours, endMinutes] = task.end_time.split(":").map((item) => parseInt(item, 10));
  
          // Переводим время окончания в минуты с полуночи
          const taskEndInMinutes = endHours * 60 + endMinutes;
  
          // Разница во времени в минутах
          const timeDiff = taskEndInMinutes - nowInMinutes;
  
          // Добавляем или обновляем флаг `isUrgent`, если разница менее 30 минут
          return {
            ...task,
            key: `${task._id}-${task.dateToComplete}`,
            isUrgent: timeDiff <= 30,

          };
        }
  
        return {
          ...task,
          key: `${task._id}-${task.dateToComplete}`,
          isUrgent: false, // Удаляем срочность для задач с другой датой
        };
      });
  
      const filteredTasks2 = tasksToUpdate.filter(task => !CompTasks.includes(String(task._id)));

      const sortedTasks = filteredTasks2.sort((a, b) => {
        if (a.isUrgent && !b.isUrgent) return -1; // Срочные задачи выше
        if (!a.isUrgent && b.isUrgent) return 1;  // Несрочные ниже
        return 0;  // Сохраняем порядок
      });
      setFilteredTasks(sortedTasks);
    };
  
    checkTasks(); // Запустить проверку при загрузке
  
    
    const interval = setInterval(checkTasks, 15 * 60 * 1000);
  
    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, [tasks, EndselectedDate, selectedDate]);

  const handleDateChange2 = (e) => {
    const selected = e.target.value; // Получаем строку вида "YYYY-MM-DD"
    const date = new Date(selected); // Преобразуем строку в объект Date
    if(clearTime(date) < clearTime(selectedDate)){
      alert('Дата кінця не може бути меншою за дату початку')
      return;
    }
    setEndSelectedDate(date); // Устанавливаем дату как объект Date
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

  return (
    <div className="table-container">
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <div
          style={{
            marginTop: "5vw",
            marginBottom: "2em",
            textAlign: "center",
          }}
        >
          {/* Поле для выбора даты */}
          <input
            type="date"
            name="startDate"
            value={formatDateForInput(selectedDate)}  // Обновим формат для отображения (YYYY-MM-DD)
            onChange={handleDateChange}  // Обработчик изменения
            required
            min={new Date().toISOString().split("T")[0]} // Ограничиваем выбор минимальной датой - сегодняшней
            className='datefirst'
          />
          <span className="date-separator">---</span>
          <input
            type="date"
            name="endDate"
            value={formatDateForInput(EndselectedDate)}  // Обновим формат для отображения (YYYY-MM-DD)
            onChange={handleDateChange2}  // Обработчик изменения
            required
            min={new Date().toISOString().split("T")[0]}
            className='datesecond'
          />
        </div>
        <table className="task-list" style={{ marginBottom: selectedTask ? "10%" : "0" }}>
          <thead>
            <tr>
              <th>Приоритет</th>
              <th>Дедлайн</th>
              <th>Лідер</th>
              <th style={{ width: "30%" }}>Назва</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => <TaskItem  key = {task.keyTime} task={task} selectedDate={selectedDate} onTaskSelected={setSelectedTask} TaskSelected={selectedTask} complTasks={complTasks} />)
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>Завдань немає</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/*<p onClick={() => downloadFile('6824a5f4d66707f0f89827b1')}>fdsfsdfdf</p>*/}
    </div>
  );
};

export default MyTasks;
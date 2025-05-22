import React, { useState, useEffect } from "react";
import "./AddTasksPage.css";
import Header from "../Header/Header";
import GreenCircle from "./png-transparent-circle-green-circle-color-grass-sphere-thumbnail.png";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css"; 
import "react-clock/dist/Clock.css";

// Функція для форматування дати у формат "yyyy-MM-ddTHH:mm"
const formatDateToLocalDatetime = (date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
};

const AddTasksPage = ({onClose}) => {
    const [taskType, setTaskType] = useState("general");
    const [importance, setImportance] = useState("0"); // Значення важливості
    const [groups, setGroups] = useState([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [taskDetails, setTaskDetails] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        repeatDays: [],
        startTime: "00:00",
        endTime: "00:00",
        group: "",
        taskType: "general",
        needphoto: false,
        needcomment: 0
    });

    const taskTypeOptions = [
        { value: "general", label: "Загальні" },
        { value: "weekly", label: "Щотижневі" },
    ];

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

    const handleTaskTypeChange = (e) => {
        const value = e.target.value;
        setTaskType(value);
        setTaskDetails((prevDetails) => ({
            ...prevDetails,
            taskType: value,
        }));
    };

    const handleImportanceChange = (e) => {
        setImportance(e.target.value);
    };

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
          startTime: newTime,
        }));
      };
      const handleTimeFinishChange = (newTime) => {
        setTaskDetails((prev) => ({
          ...prev,
          endTime: newTime,
        }));
      };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setTaskDetails((prevDetails) => {
            const updatedDays = checked
                ? [...prevDetails.repeatDays, value]
                : prevDetails.repeatDays.filter((day) => day !== value);
            return { ...prevDetails, repeatDays: updatedDays };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Отмена стандартного поведения формы
        if(taskDetails.taskType === 'weekly' && taskDetails.repeatDays.length === 0){
            alert("Якщо ви обрали це завдання ви повинні обрати хоча б один день")
            return;
        }
        if(new Date(taskDetails.startDate) > new Date(taskDetails.endDate)){
            alert("Дата початку не може бути більшою за дату закінчення")
            return;
        }
        if(taskDetails.startTime > taskDetails.endTime){
            alert("Час початку не може бути більшою за час закінчення")
            return;
        }

        // Создание объекта с данными из формы
        const taskData = {
            title: taskDetails.title,
            description: taskDetails.description,
            taskType: taskDetails.taskType,
            startDate: taskDetails.startDate,
            endDate: taskDetails.endDate,
            repeatDays: taskDetails.repeatDays,
            startTime: taskDetails.startTime,
            endTime: taskDetails.endTime,
            group: taskDetails.group,
            needphoto: taskDetails.needphoto,
            needcomment: taskDetails.needcomment,
            importance, // Добавляем значение важности
        };

        console.log("Task submitted:", taskData);

        const token = localStorage.getItem("token");
        if (!token) {
            alert("У вас нет прав для выполнения этой операции.");
            window.location.href = "/";
            return;
        }

        fetch(`${process.env.REACT_APP_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(taskData), // отправляем данные в теле запроса
        })
            .then((response) => response.json()) // Получаем ответ от сервера
            .then((data) => {
                console.log("Task successfully submitted to API:", data);
                alert("Завдання успішно створено!");
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error submitting task:", error);
            });
    };

    return (
            <div className="modal-overlay4" style = {{width:"80vw!important"}}>
            <div className="modal-content4">
            <div >
                <div className="task-form_addTask">
                <button type="button" style = {{marginTop: '1vw', width: '5%', marginLeft: '90%'}} onClick={onClose} >X</button>
                    <h3 style={{marginTop: '1vw'}}>Додати завдання</h3>
                    <div className="form-row">
                    <div
  className="form-group2_addTask"
  style={{
    display: "flex", // Включаем флексбокс
    alignItems: "center", // Центрируем элементы по вертикали
    gap: "0px",
    marginLeft:'9vw',
    marginRight: '17.5vw' // Добавляем расстояние между label и select
  }}
>
  <label style={{ marginRight: "10px" }}>Тип</label>
  <select
    value={taskType}
    onChange={handleTaskTypeChange}
    className="task-type-select_addTask"
  >
    {taskTypeOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>

                    <div className="form-group2_addTask" style={{
    display: "flex", // Включаем флексбокс
    alignItems: "center", // Центрируем элементы по вертикали
    gap: "0px"
  }}>
                        <label>Приоритет</label>
                        <select
                            value={importance}
                            onChange={handleImportanceChange}
                            className="task-type-select_addTask"
                        >
                            {importanceOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div></div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group_addTask">
                            <label>Назва</label>
                            <input
                                type="text"
                                name="title"
                                value={taskDetails.title}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group_addTask">
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
                        {taskType === "weekly" && (
                            <>
                                <div className="form-group_addTask">
                                    <label>Оберіть дні тижня</label>
                                    <div className="form-row">
                                        {daysOfWeek.map((day) => (
                                            <label key={day.value} className="checkbox-label_addTask">
                                                <input
                                                    type="checkbox"
                                                    value={day.value}
                                                    checked={taskDetails.repeatDays.includes(day.value)}
                                                    onChange={handleCheckboxChange}
                                                />
                                                <span>{day.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="form-row column_style">
                            <div className="form-group_addTask">
                                <label>Діє з</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={taskDetails.startDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                    style={{ width: "25em" }}
                                />
                            </div>
                            <div className="form-group_addTask">
                                <label>Діє по</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={taskDetails.endDate}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split("T")[0]}
                                    required
                                    style={{ width: "25em" }}
                                />
                            </div>
                        </div>
                        
                                <div className="form-row column_style">
            <div style={{marginTop: "1em"}} className="form-group3time_addTask">
            <label>Час початку</label>
            <TimePicker
        id="startTime"
        name="startTime"
        defaultValue="00:00"
        value={taskDetails.startTime}
        onChange={handleTimeStartChange}
        style={{ width: "40em" }}
        format="HH:mm" // Формат времени (24-часовой)
        required
        className="timecustomise"
      />
          </div>
        <div style={{marginTop: "1em"}} className="form-group3time_addTask">
            <label>Час закінчення</label>
            <TimePicker
        id="endTime"
        name="endTime"
        value={taskDetails.endTime}
        onChange={handleTimeFinishChange}
        style={{width: "40em"}}
        format="HH:mm" // Формат времени (24-часовой)
        required
        className="timecustomise"
      />
          </div>
                                </div>
                                <div className="form-group_addTask">
                            <label style = {{marginTop:'15px'}}>Опис</label>
                            <textarea
                                name="description"
                                value={taskDetails.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-row">
                        <div className = "checkboxaddtask" style={{ marginRight: "25%",marginLeft:'15%', position: "relative" }}>
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
                        <button type="submit" className="submit-button_addTask" disabled = {!(groups.length > 0)}>
                            Зберегти
                        </button>
                    </form>
                </div>
            </div>
        </div></div>
    );
};

export default AddTasksPage;
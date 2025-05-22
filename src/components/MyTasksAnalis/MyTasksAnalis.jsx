import React, { useState, useEffect } from "react";
import styles from "./MyTasksAnalis.module.css";
import excel from "../../excel.png";
import userslist from "../../userslist.png";
import success from "../../success.svg"
import cancelIcon from '../../cancel.svg';
const GroupUsersModal = ({ isOpen, onClose, selectedGroup, groupUsers }) => {
    if (!isOpen) return null;
  
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
          <h2 style={{ marginTop: '0.5em' }}>
            Користувачі в групі: {selectedGroup}
          </h2>
          <table className={styles.groupUsersTable}>
            <thead>
              <tr>
                <th>Ім'я</th>
                <th>Телефон</th>
                <th>Telegram</th>
              </tr>
            </thead>
            <tbody>
              {groupUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>{user.telegramName || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const TaskDetailsModal = ({ isOpen, onClose, taskData }) => {
    if (!isOpen || !taskData) return null;
    const dayMap = {
      Monday: "Пн",
      Tuesday: "Вт",
      Wednesday: "Ср",
      Thursday: "Чт",
      Friday: "Пт",
      Saturday: "Сб",
      Sunday: "Нд",
    };
    const importanceMap = {
      "0": "Не дуже важливо",
      "1": "Важливо",
      "2": "Дуже важливо",
    };
    const taskTypeMap = {
      general: "Загальне",
      weekly: "Щотижневe",
    };
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>×</button>
          <h2 style={{marginBottom:'15px'}}>Деталі завдання</h2>
          <div className={styles.taskDetails}>
            <p><strong>Назва:</strong> {taskData.title}</p>
            <p><strong>Опис:</strong> {taskData.description}</p>
            <p><strong>Дата початку:</strong> {taskData.start_date} {taskData.start_time}</p>
            <p><strong>Дата завершення:</strong> {taskData.end_date} {taskData.end_time}</p>
            <p><strong>Група:</strong> {taskData.group}</p>
            <p><strong>Тип завдання:</strong> {taskTypeMap[taskData.task_type]}</p>
{taskData.repeat_days && taskData.repeat_days.length > 0 && (
  <p><strong>Повторюється:</strong> {taskData.repeat_days.map(day => dayMap[day]).join(", ")}</p>
)}
<p><strong>Важливість:</strong> {importanceMap[taskData.importance]}</p>
            <p><strong>Потрібне фото:</strong> {taskData.needphoto ? "Так" : "Ні"}</p>
            <p><strong>Потрібен коментар:</strong> {taskData.needcomment ? "Так" : "Ні"}</p>
            <p><strong>Створив(ла):</strong> {taskData.created_name}</p>
          </div>
        </div>
      </div>
    );
  };

  const GroupUsersModal2 = ({ isOpen, onClose, groupsUsers }) => {
    if (!isOpen) return null;
  
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
          <h2 style={{ marginTop: '0.5em', marginBottom:'1em' }}>Користувачі в групах</h2>
  
          <div className={styles.groupsContainer}>
            {Object.keys(groupsUsers).map((groupName, index) => (
              <div key={index} className={styles.groupSection}>
                <h3 >{groupName}</h3>
                <table style = {{marginTop:'10px', marginBottom:'1em'}}className={styles.groupUsersTable}>
                  <thead>
                    <tr>
                      <th>Ім'я</th>
                      <th>Телефон</th>
                      <th>Telegram</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupsUsers[groupName].map((user, index) => (
                      <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.phone}</td>
                        <td>{user.telegramName || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  const GroupTasksList = ({ groupName, tasks }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [modalImage, setModalImage] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fetchTaskDetails = async (taskId) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/task/${taskId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error("Не вдалося отримати дані завдання");
        }
    
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Помилка при отриманні деталей завдання:", error);
        return null;
      }
    };
    const handleOpenModal = async (taskId) => {
      const task = await fetchTaskDetails(taskId);
      if (task) {
        setSelectedTask(task);
        setIsModalOpen(true);
      }
    };
    
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedTask(null);
    };
    const toggleExpand = (index) => {
        setExpandedIndex(prev => (prev === index ? null : index));
    };

    return (
      
        <div className={styles.wrapper}>
          <TaskDetailsModal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  taskData={selectedTask}
/>
          {modalImage && (
  <div className={styles.modalOverlay} onClick={() => setModalImage(null)}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeButton} onClick={() => setModalImage(null)}>✖</button>
      <img src={modalImage.url} alt={modalImage.name} className={styles.modalImage} />
    </div>
  </div>
)}
            <h2 className={styles.header}>Завдання для групи: {groupName}</h2>
            <div style={{ marginTop: '5px'}}>
      <strong>Час виконання усіх завдань за цей період: {
                (() => {
                  const minutes = tasks[0] || 0;
                  const hours = Math.floor(minutes / 60);
                  const remainingMinutes = minutes % 60;

                  if (hours > 0 && remainingMinutes > 0) {
                    return `${hours} год ${remainingMinutes} хв`;
                  } else if (hours > 0) {
                    return `${hours} год`;
                  } else {
                    return `${remainingMinutes} хв`;
                  }
                })()
              }</strong>
    </div>
            <div style = {{marginTop:'15px'}} className={styles.scrollContainer}>
            {tasks.slice(1).map((task, index) => {
  const isExpanded = expandedIndex === index;

  if (task.status === 1) {
    // Завершена задача
    return (
      <div key={index} className={styles.taskCard} onClick={() => toggleExpand(index)}>
        <div className={styles.taskContent}>
          <div className={styles.taskText}>
          <div className={styles.taskText}>
  <div onClick={(e) => {e.stopPropagation();handleOpenModal(task.id_task)}} className={`${styles.taskTitle}`}
  ><strong>Назва:</strong> <span className={styles.Link}>{task.task_name} </span></div>
</div>
            <div><strong>Час початку:</strong> {task.start_time}</div>
            <div><strong>Час завершення:</strong> {task.finish_time}</div>
            <div>
              <strong>Час виконання:</strong> {
                (() => {
                  const minutes = task.active_minutes || 0;
                  const hours = Math.floor(minutes / 60);
                  const remainingMinutes = minutes % 60;

                  if (hours > 0 && remainingMinutes > 0) {
                    return `${hours} год ${remainingMinutes} хв`;
                  } else if (hours > 0) {
                    return `${hours} год`;
                  } else {
                    return `${remainingMinutes} хв`;
                  }
                })()
              }
            </div>
            <div><strong>Вчасно:</strong> {task.in_time === 1 ? "Так" : "Ні"}</div>
          </div>

          <div className={styles.taskImage}>
            <img src={success} alt="Статус" />
          </div>
        </div>

        {isExpanded && (
          <div className={styles.expandedSection}>
            {task.pause_start?.length > 0 && task.pause_end?.length > 0 && (
              <div className={styles.pauses}>
                <strong>Паузи:</strong>
                <ul>
                  {task.pause_start.map((start, i) => {
                    const startTime = (start.split(", ")[1] || "").slice(0, 5);
                    const endTime = (task.pause_end[i] || "").split(", ")[1]?.slice(0, 5) || "";
                    return <div key={i}>⏸️ Пауза {i + 1}: з {startTime} до {endTime}</div>;
                  })}
                </ul>
                <div style={{ marginTop: '5px' }}>
                  <strong>Час пауз:</strong> {
                    (() => {
                      const minutes = task.pause_minutes || 0;
                      const hours = Math.floor(minutes / 60);
                      const remainingMinutes = minutes % 60;

                      if (hours > 0 && remainingMinutes > 0) {
                        return `${hours} год ${remainingMinutes} хв`;
                      } else if (hours > 0) {
                        return `${hours} год`;
                      } else {
                        return `${remainingMinutes} хв`;
                      }
                    })()
                  }
                </div>
              </div>
            )}

            <div className={styles.commentbox}>
              <strong>Коментар:</strong>
              <div className={styles.commentcontent}>{task.comment || "Немає"}</div>
            </div>

            <div className={styles.photosGrid}>
              {task.photos && task.photos.length > 0 ? (
                <>
                  <strong style={{ marginTop: '15px', display: 'block' }}>Фото:</strong>
                  {task.photos.map((photo, i) => (
                    <div className={styles.commentbox} key={i}>
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = `${process.env.REACT_APP_URL}/download_file/${photo.file_id}`;
                          setModalImage({ url, name: photo.filename });
                        }}
                        className={`${styles.commentcontent} `}
                      >
                        {i + 1}: <span className={styles.Link}>{photo.filename}</span>
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <div className={styles.noPhotos}>Фото відсутні</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div key={index} className={`${styles.taskCard} ${styles.cancelled}`} onClick={() => toggleExpand(index)}>
  <div className={styles.taskContent}>
    <div className={styles.taskText}>
    <div className={styles.taskText}>
  <div onClick={(e) => {e.stopPropagation();handleOpenModal(task.id_task)}} className={`${styles.taskTitle}`}
  ><strong>Назва:</strong> <span className={styles.Link}>{task.task_name}</span></div>
</div>
      <div><strong>Час скасування:</strong> {task.finish_time}</div>
    </div>
    <div className={styles.taskImage}>
      <img src={cancelIcon} alt="Скасовано" />
    </div>
  </div>

  {isExpanded && (
    <div className={styles.expandedSection}>
      <div className={styles.commentbox}>
        <strong>Коментар:</strong>
        <div className={styles.commentcontent}>{task.comment || "Немає"}</div>
      </div>
    </div>
  )}
</div>
    );
  }
})}
            </div>
        </div>
    );
};
const MultiGroupTasksList = ({ selectedGroups, groupedTasks }) => {
  return (
    <div className={styles.multiGroupWrapper}>
      {selectedGroups.map((groupName) => (
        <GroupTasksList
          key={groupName}
          groupName={groupName}
          tasks={groupedTasks[groupName] || []}
        />
      ))}
    </div>
  );
};


function MyTaskAnalis() {
    const getMidnightDate = () => {
        const midnight = new Date();
        midnight.setHours(0, 0, 0, 0);
        return midnight;
    };
    const [groupUsers, setGroupUsers] = useState([]);
    const [isGroupUsersModalOpen, setIsGroupUsersModalOpen] = useState(false);
    const [groupsData, setGroupsData] = useState({});
    const [isGroupUsersModalOpen2, setIsGroupUsersModalOpen2] = useState(false);
    const [groupUsers2, setGroupUsers2] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedDate, setSelectedDate] = useState(getMidnightDate());
    const [EndselectedDate, setEndSelectedDate] = useState(getMidnightDate());
    const [groupFilter, setGroupFilter] = useState("");

    const [selectMode, setSelectMode] = useState(false);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [showMultiGroupTable, setShowMultiGroupTable] = useState(false);

    const token = localStorage.getItem("token");

    const clearTime = (date) => {
        const clearedDate = new Date(date);
        clearedDate.setHours(0, 0, 0, 0);
        return clearedDate;
    };

    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchAnalytics = async () => {
        if (!token) {
            alert("У вас немає прав на користування цією сторінкою");
            window.location.href = "/";
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_APP_URL}/tasks_by_group?start_date=${formatDateForInput(selectedDate)}&end_date=${formatDateForInput(EndselectedDate)}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Помилка при отриманні аналітики");
            }

            const data = await response.json();
            console.log("Fetched data:", data);
            setGroupsData(data);

            if (selectedGroup && !data[selectedGroup]) {
                setSelectedGroup(null);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setGroupsData({});
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [selectedDate, EndselectedDate]);

    const handleDateChange = (e) => {
        const selected = new Date(e.target.value);
        if (clearTime(selected) > clearTime(EndselectedDate)) {
            alert("Дата початку не може бути більшою за дату кінця");
            return;
        }
        setSelectedDate(selected);
    };
    const getuserslist2 = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_URL}/get_users_info_group2`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ groups_names: selectedGroups }),
          });
          const data = await response.json();
          setGroupUsers2(data); // Сохраняем пользователей в состояние
          setIsGroupUsersModalOpen2(true); // Открываем модалку
          if (!response.ok) throw new Error("Failed to fetch users");
        } catch (error) {
          alert("Помилка при отриманні користувачів групи: " + error.message);
        }
      };

    const getuserslist = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_URL}/get_users_info_group`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ group_name: selectedGroup }),
          });
      
          if (!response.ok) throw new Error("Failed to fetch users");
      
          const data = await response.json();
          setGroupUsers(data.users); // Сохраняем пользователей в состояние
          setIsGroupUsersModalOpen(true); // Открываем модалку
        } catch (error) {
          alert("Помилка при отриманні користувачів групи: " + error.message);
        }
      };

    const handleDateChange2 = (e) => {
        const selected = new Date(e.target.value);
        if (clearTime(selected) < clearTime(selectedDate)) {
            alert("Дата кінця не може бути меншою за дату початку");
            return;
        }
        setEndSelectedDate(selected);
    };

    const toggleSelectMode = () => {
        setSelectMode(!selectMode);
        setSelectedGroups([]);
        setShowMultiGroupTable(false);
    };

    const toggleSelectGroup = (groupName) => {
        setSelectedGroups((prev) =>
            prev.includes(groupName)
                ? prev.filter((name) => name !== groupName)
                : [...prev, groupName]
        );
    };

    return (
        
        <div className={styles.pageContainer}>
{isGroupUsersModalOpen && (
  <GroupUsersModal
    isOpen={isGroupUsersModalOpen}
    onClose={() => setIsGroupUsersModalOpen(false)}
    selectedGroup={selectedGroup}
    groupUsers={groupUsers}
  />
)}
{isGroupUsersModalOpen2 && (
  <GroupUsersModal2
    isOpen={isGroupUsersModalOpen2}
    onClose={() => setIsGroupUsersModalOpen2(false)}
    groupsUsers={groupUsers2}
  />
)}

            <div style={{ marginTop: "5vw", marginBottom: "2em", textAlign: "center" }}>
                <input
                    type="date"
                    name="startDate"
                    value={formatDateForInput(selectedDate)}
                    onChange={handleDateChange}
                    className="datefirst"
                    max={new Date().toISOString().split("T")[0]}
                />
                <span className="date-separator">---</span>
                <input
                    type="date"
                    name="endDate"
                    value={formatDateForInput(EndselectedDate)}
                    onChange={handleDateChange2}
                    max={new Date().toISOString().split("T")[0]}
                    className="datesecond"
                />
            </div>

            {!selectedGroup && !showMultiGroupTable ? (
                <div>
                    <div className={styles.searchRow}>
                        <input
                            type="text"
                            placeholder="Пошук групи..."
                            value={groupFilter}
                            onChange={(e) => setGroupFilter(e.target.value)}
                            className={styles.searchInput}
                        />
                        <button onClick={toggleSelectMode} className={styles.selectButton}>
                            {selectMode ? "Відмінити" : "Виділити"}
                        </button>
                        {selectMode && selectedGroups.length >= 2 && (
                            <button className={styles.reportButton} onClick={() => setShowMultiGroupTable(true)}>
                                Показати таблицю
                            </button>
                        )}
                    </div>

                    <div className={styles.groupsList}>
                        {Object.keys(groupsData).length > 0 ? (
                            Object.keys(groupsData)
                                .filter(group => group.toLowerCase().includes(groupFilter.toLowerCase()))
                                .map((group, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.groupCard} ${selectedGroups.includes(group) ? styles.groupCardSelected : ""}`}
                                        onClick={() => {
                                            if (selectMode) {
                                                toggleSelectGroup(group);
                                            } else {
                                                setSelectedGroup(group);
                                            }
                                        }}
                                    >
                                        <span className={styles.groupName}>
                                            {group}
                                        </span>
                                    </div>
                                ))
                        ) : (
                            <p className={styles.emptyText}>Немає доступних груп для цієї дати</p>
                        )}
                    </div>
                </div>
            ) : showMultiGroupTable ? (
                <div>
                    <button onClick={() => {
                        setShowMultiGroupTable(false);
                        setSelectedGroups([]);
                        setSelectMode(false);
                    }} className={styles.backButton}>
                        ← Назад
                    </button>
                    <MultiGroupTasksList
      selectedGroups={selectedGroups}
      groupedTasks={groupsData}
    />
                </div>
            ) : (
                <div>
                    <button onClick={() => setSelectedGroup(null)} className={styles.backButton}>
                        ← Назад
                    </button>
                    <GroupTasksList groupName={selectedGroup} tasks={groupsData[selectedGroup] || []} />

                </div>
            )}
        </div>
    );
}

export default MyTaskAnalis;

import React, { useState, useEffect } from "react";
import styles from "./TaskAnalisBoss.module.css";
import excel from "../../excel.png";
import userslist from "../../userslist.png";
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

function TasksAnalisBoss() {
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

    const downloadExcelFile = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/download_excel_tasks_analytic?start_date=${formatDateForInput(selectedDate)}&end_date=${formatDateForInput(EndselectedDate)}&group=${selectedGroup}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(groupsData[selectedGroup])
            });

            if (!response.ok) {
                throw new Error("Failed to fetch the Excel file");
            }

            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "tasks_report.xlsx";
            link.click();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const downloadExcelFile2 = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL}/download_excel_tasks_analytic2?start_date=${formatDateForInput(selectedDate)}&end_date=${formatDateForInput(EndselectedDate)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    groups_data: groupsData,
                    groups: selectedGroups
                  })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch the Excel file");
            }

            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "tasks_report.xlsx";
            link.click();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const fetchAnalytics = async () => {
        if (!token) {
            alert("У вас немає прав на користування цією сторінкою");
            window.location.href = "/";
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_APP_URL}/get_my_groups_analytic?start_date=${formatDateForInput(selectedDate)}&end_date=${formatDateForInput(EndselectedDate)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
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
                    <img src={userslist} onClick={getuserslist2} className={styles.userimage} alt="Користувачі" />
                    <img src={excel} onClick={downloadExcelFile2} className={styles.excelimage} alt="Скачати Excel" />
                    <table className={styles.groupTable}>
                        <thead>
                            <tr>
                                <th>Користувач</th>
                                <th>Поставленно</th>
                                <th>Виконанно</th>
                                <th>Невчасно</th>
                                <th>% Виконання</th>
                                <th>% Ігнорування</th>
                            </tr>
                        </thead>
                        <tbody>
                        {selectedGroups.map(group =>
                        
    groupsData[group]?.map((entry, idx) => (
        <React.Fragment key={`${group}-${idx}`}>
            {idx === 0 && (
                <tr style={{ border: "1px solid #B3E5FC", backgroundColor: "#E1F5FE", color: '#01579B', fontWeight: "bold", textAlign: "center" }}>
                    <td colSpan="7">{group}</td>
                </tr>
            )}
            {idx === groupsData[group].length - 1 && (
                <tr style = {{border: "1px solid #B3E5FC", backgroundColor: "#b0ffb3", color:'#01579B', fontWeight: "bold", textAlign: "center"}}>
                <td>{entry[0]}</td>
                <td>{entry[1]}</td>
                <td>{entry[2]}</td>
                <td>{entry[3]}</td>
                <td>{entry[4]}%</td>
                <td>{entry[5]}%</td>
            </tr>
             )}
            {idx !== 0 && idx !== groupsData[group].length - 1 && (
            <tr>
                <td>{entry[0]}</td>
                <td>{groupsData[group][0]}</td>
                <td>{entry[1]}</td>
                <td>{entry[2]}</td>
                <td>{entry[3]}%</td>
                <td>{entry[4]}%</td>
            </tr>
            )}
        </React.Fragment>
    ))
)}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>
                    <button onClick={() => setSelectedGroup(null)} className={styles.backButton}>
                        ← Назад
                    </button>
                    <img src={userslist} onClick={getuserslist} className={styles.userimage} alt="Користувачі" />
                    <img src={excel} onClick={downloadExcelFile} className={styles.excelimage} alt="Скачати Excel" />
                    {groupsData[selectedGroup] && (
                        <table className={styles.groupTable}>
                            <thead>
                                <tr>
                                    <th colSpan="1">{selectedGroup}</th>
                                    <th colSpan="3">Задачі</th>
                                    <th colSpan="2">Результат</th>
                                </tr>
                                <tr>
                                    <th>Користувач</th>
                                    <th>Поставленно</th>
                                    <th>Виконанно</th>
                                    <th>Невчасно</th>
                                    <th>% Виконання</th>
                                    <th>% Ігнорування</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupsData[selectedGroup].map((entry, idx) => (
                                    <>
                                        {idx === 0 && (
                                            <tr key="header" style = {{border: "1px solid #B3E5FC", backgroundColor: "#E1F5FE", color:'#01579B', fontWeight: "bold", textAlign: "center"}}>
                                                <td colSpan="6">{selectedGroup}</td>
                                            </tr>
                                        )}
                                        {idx === groupsData[selectedGroup].length - 1 && (
                <tr style = {{border: "1px solid #B3E5FC", backgroundColor: "#b0ffb3", color:'#01579B', fontWeight: "bold", textAlign: "center"}}>
                <td>{entry[0]}</td>
                <td>{entry[1]}</td>
                <td>{entry[2]}</td>
                <td>{entry[3]}</td>
                <td>{entry[4]}%</td>
                <td>{entry[5]}%</td>
            </tr>
             )}
                                        {idx !== 0 && idx !== groupsData[selectedGroup].length - 1 && (
                                        <tr key={idx}>
                                            <td>{entry[0]}</td>
                                            <td>{groupsData[selectedGroup][0]}</td>
                                            <td>{entry[1]}</td>
                                            <td>{entry[2]}</td>
                                            <td>{entry[3]}%</td>
                                            <td>{entry[4]}%</td>
                                        </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

export default TasksAnalisBoss;

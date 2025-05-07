import React, { useState, useEffect } from "react";
import styles from "./TaskAnalisBoss.module.css";
import excel from "../../excel.png";

function TasksAnalisBoss() {
    const getMidnightDate = () => {
        const midnight = new Date();
        midnight.setHours(0, 0, 0, 0);
        return midnight;
    };

    const [groupsData, setGroupsData] = useState({});
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

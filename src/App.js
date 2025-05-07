import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage/Homepage'
import AdminPage from './components/AdminPage/AdminPage';
import AddTaskPage from './components/AddTasksPage/AddTasksPage';
import MyTask from './components/MyTasks/MyTasks';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/addtask" element={<AddTaskPage />} />
                <Route path="/my" element={<MyTask />} />
            </Routes>
        </Router>
    );
}

export default App;

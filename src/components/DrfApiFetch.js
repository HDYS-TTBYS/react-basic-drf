import React, { useState, useEffect } from "react";
import axios from "axios";

const DrfApiFetch = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState([]);
    const [editedTask, setEditedTask] = useState({ id: "", title: "" });
    const [id, setId] = useState(1);

    useEffect(() => {
        axios.get("http://localhost:58939/api/tasks/", {
            headers: {
                "Authorization": "Token b6836be871e04873e0095f6aef0b21ce9a141efb"
            }
        })
            .then(res => {
                setTasks(res.data);
            });
    }, []);

    const getTask = () => {
        axios.get(`http://localhost:58939/api/tasks/${id}/`, {
            headers: {
                "Authorization": "Token b6836be871e04873e0095f6aef0b21ce9a141efb"
            }
        })
            .then(res => {
                setSelectedTask(res.data);
            });
    }

    const deleteTask = (id) => {
        axios.delete(`http://localhost:58939/api/tasks/${id}/`, {
            headers: {
                "Authorization": "Token b6836be871e04873e0095f6aef0b21ce9a141efb"
            }
        })
            .then(res => {
                setTasks(tasks.filter(task => task.id !== id));
                setSelectedTask([]);
                if (editedTask.id === id) {　　　　　　　　　　　/*ここから3行追加*/
                    setEditedTask({ id: "", title: "" });
                }
            });
    }

    const newTask = (task) => {

        const data = {
            title: task.title
        }
        axios.post(`http://localhost:58939/api/tasks/`, data, {
            headers: {
                "Content-type": "application/json",
                "Authorization": "Token b6836be871e04873e0095f6aef0b21ce9a141efb"
            }
        })
            .then(res => {
                setTasks([...tasks, res.data]);
                setEditedTask({ id: "", title: "" });
            });
    }

    const editTask = (task) => {

        axios.put(`http://localhost:58939/api/tasks/${task.id}/`, task, {
            headers: {
                "Content-type": "application/json",
                "Authorization": "Token b6836be871e04873e0095f6aef0b21ce9a141efb"
            }
        })
            .then(res => {
                setTasks(tasks.map(task => (task.id === editedTask.id ? res.data : task)));
                setEditedTask({ id: "", title: "" });
            });

    }

    const handleInputChange = () => e => {
        const value = e.target.value;
        const name = e.target.name;
        setEditedTask({ ...editedTask, [name]: value });
    }

    return (
        <div>
            <ul>
                {
                    tasks.map(task => <li key={task.id}> {task.title} {task.id}
                        <button onClick={() => deleteTask(task.id)}>
                            <i className="fas fa-trash-alt"></i>
                        </button>
                        <button onClick={() => setEditedTask(task)}>
                            <i className="fas fa-pen"></i>
                        </button>
                    </li>
                    )
                }
            </ul>

            Set id < br />
            <input type="text" value={id} onChange={e => { setId(e.target.value) }} />
            <br />
            <button type="buttom" onClick={() => { getTask() }}>Get Task</button>

            <h3> Title:{selectedTask.title} ID:{selectedTask.id}</h3>

            <input type="text" name="title"
                value={editedTask.title}
                onChange={handleInputChange()}
                placeholder="New Task ?" required />
            {editedTask.id ?
                <button onClick={() => editTask(editedTask)} >Update</button> :
                <button onClick={() => newTask(editedTask)} >Create</button>
            }

        </div >
    )
}

export default DrfApiFetch;

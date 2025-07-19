import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTodo,
  deleteTodo,
  completeTodo,
  deleteCompleted,
  editTodo,
} from './features/todoSlice';

import './App.css';
import { MdDelete } from 'react-icons/md';
import { FaCheck, FaEdit } from 'react-icons/fa';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const allTodos = useSelector((state) => state.todos.allTodos);
  const completedTodos = useSelector((state) => state.todos.completedTodos);
  const dispatch = useDispatch();




  const handleAddTodo = () => {
    dispatch(
      addTodo({
        title: newTitle,
        description: newDescription,
        dueDate: newDueDate,
      })
    );
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
  };

  const handleComplete = (index) => {
    dispatch(completeTodo(index));
  };

  const handleDeleteCompleted = (index) => {
    dispatch(deleteCompleted(index));
  };
  const filteredTodos = allTodos.filter((todo) =>
  todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  todo.description.toLowerCase().includes(searchTerm.toLowerCase())
);

 const isOverdue = (date) => {
  if (!date) return false;
  const dueDate = new Date(date);
  const today = new Date();
  return dueDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
};

const isDueSoon = (date) => {
  if (!date) return false;
  const dueDate = new Date(date);
  const today = new Date();
  const diff = dueDate - today;
  return diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000; // less than 3 days
};
  

  return (
    <div className="App">
      <h1>My Todos</h1>

      <div className="todo-wrapper">
        {/* Input Section */}
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="what's the task title?"
            />
          </div>

          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="what's the task description?"
            />
          </div>

           <div className="todo-input-item">
            <label>Due Date</label>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
          </div>

          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>

         
        </div>

        {/* For toggling between todo screen and not yet completed task  */}
        <div className="btn-area">
          <button
            className={`secondaryBtn ${!isCompleteScreen && "active"}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen && "active"}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        {/* My Todo List */}

        <div className="search-input">
          <label>Search Tasks </label>
          <input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="todo-list">
          {!isCompleteScreen &&
            filteredTodos.map((item, index) => {
              const isEditing = editIndex === index;

              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    {!isEditing ? (
                      <>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <p
                          className={
                            isOverdue(item.dueDate)
                              ? "overdue"
                              : isDueSoon(item.dueDate)
                              ? "soon"
                              : ""
                          }
                        >
                          <small>Due: {item.dueDate}</small>
                        </p>

                        <button
                          className="secondaryBtnBtn"
                          onClick={() => {
                            setEditIndex(index);
                            setEditTitle(item.title);
                            setEditDescription(item.description);
                          }}
                        >
                          <FaEdit style={{ marginRight: "5px" }} />
                          Edit
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Edit title"
                          className="edit-input"
                        />
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Edit description"
                          className="edit-input"
                        />
                      </>
                    )}
                  </div>

                  <div>
                    {!isEditing ? (
                      <>
                        <MdDelete
                          className="icon"
                          onClick={() => dispatch(deleteTodo(index))}
                          title="Delete?"
                        />
                        <FaCheck
                          className="check-icon"
                          onClick={() => handleComplete(index)}
                          title="Complete?"
                        />
                      </>
                    ) : (
                      <button
                        className="primaryBtn"
                        onClick={() => {
                          dispatch(
                            editTodo({
                              index,
                              newTitle: editTitle,
                              newDescription: editDescription,
                            })
                          );
                          setEditIndex(null);
                          setEditTitle("");
                          setEditDescription("");
                        }}
                      >
                        Save
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          {/* Screen that shows Completed List */}
          {isCompleteScreen &&
            completedTodos.map((item, index) => (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>
                    <small>Completed On: {item.completedOn}</small>
                  </p>
                </div>
                <div>
                  <MdDelete
                    className="icon"
                    onClick={() => handleDeleteCompleted(index)}
                    title="Delete?"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
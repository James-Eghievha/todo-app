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

  const allTodos = useSelector((state) => state.todos.allTodos);
  const completedTodos = useSelector((state) => state.todos.completedTodos);
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    dispatch(addTodo({ title: newTitle, description: newDescription }));
    setNewTitle('');
    setNewDescription('');
  };

  const handleComplete = (index) => {
    dispatch(completeTodo(index));
  };

  const handleDeleteCompleted = (index) => {
    dispatch(deleteCompleted(index));
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
            className={`secondaryBtn ${!isCompleteScreen && 'active'}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        {/* My Todo List */}
        <div className="todo-list">
          {!isCompleteScreen &&
            allTodos.map((item, index) => {
              const isEditing = editIndex === index;

              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    {!isEditing ? (
                      <>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
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
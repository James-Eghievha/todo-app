// src/features/todoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allTodos: [],
  completedTodos: []
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.allTodos.push(action.payload);
    },
    deleteTodo: (state, action) => {
      state.allTodos.splice(action.payload, 1);
    },
    completeTodo: (state, action) => {
      const index = action.payload;
      const now = new Date().toLocaleString();
      const completedItem = {
        ...state.allTodos[index],
        completedOn: now
      };
      state.completedTodos.push(completedItem);
      state.allTodos.splice(index, 1);
    },
    deleteCompleted: (state, action) => {
      state.completedTodos.splice(action.payload, 1);
    },
    editTodo: (state, action) => {
      const { index, newTitle, newDescription } = action.payload;
      state.allTodos[index].title = newTitle;
      state.allTodos[index].description = newDescription;
    }
  }
});

export const { addTodo, deleteTodo, completeTodo, deleteCompleted, editTodo } = todoSlice.actions;
export default todoSlice.reducer;
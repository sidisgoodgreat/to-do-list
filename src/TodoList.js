import React, { useState, useEffect } from 'react';
import './App.css';

const TodoList = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const currentDate = new Date();
    const todoDate = dueDate ? new Date(dueDate) : currentDate;

    const todo = {
      id: Date.now(),
      todo: newTodo,
      dueDateTimestamp: todoDate.toISOString()
    };

    setTodos([...todos, todo]);
    setNewTodo('');
    setDueDate('');
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
      return '';
    }

    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateStr;
    if (d.toDateString() === today.toDateString()) {
      dateStr = 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
      dateStr = 'Yesterday';
    } else {
      dateStr = d.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    
    return `${displayHours}:${minutes} ${ampm} - ${dateStr}`;
  };

  return (
    <div className="todo-list">
      <h1>TODO LIST</h1>
      
      <div className="add-item">
        <h2>ADD ITEM</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            maxLength={100}
            placeholder="Add new todo"
          />
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>

      <div className="todos">
        <h2>TODOS</h2>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <div className="todo-content">
                <div className="todo-text">{todo.todo}</div>
                <div className="todo-date">{formatDate(todo.dueDateTimestamp)}</div>
              </div>
              <button onClick={() => deleteTodo(todo.id)}>×</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;

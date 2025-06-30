import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const BASE_URL = 'https://wishnest-backend.onrender.com';

function Wishlist({ setIsLoggedIn, user,isDark, toggleTheme  }) {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodoList(res.data);
    } catch (err) {
      console.error('Fetch wishlist error:', err);
    }
  };

  if (token) fetchWishlist(); // Only fetch if token exists
}, [token]);


  const onTodoInputChange = (e) => {
    setTodo(e.target.value);
  };

  const onAddtodoClick = async () => {
  if (!todo || todo.trim() === '') {
    alert('Please enter something before adding to your wishlist.');
    return;
  }

  try {
    const res = await axios.post(`${BASE_URL}/api/wishlist`, {
      todo: todo.trim()
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setTodoList([...todoList, res.data]);
    setTodo('');
  } catch (err) {
    console.error('Add todo error:', err);
    alert("Error adding item. Check console.");
  }
};

  const onDeleteClick = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodoList(todoList.filter(item => item._id !== id));
    } catch (err) {
      console.error('Delete todo error:', err);
    }
  };

  const onTodoCheckChange = async (id) => {
  const updatedTodo = todoList.find(todo => todo._id === id);
  if (!updatedTodo) return;

  const newStatus = !updatedTodo.isCompleted;

  try {
    const res = await axios.put(`${BASE_URL}/api/wishlist/${id}`, {
      isCompleted: newStatus
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Defensive check for res.data
    if (!res.data) {
      console.error('Empty response when toggling todo.');
      return;
    }

    setTodoList(todoList.map(todo =>
      todo._id === id ? res.data : todo
    ));
  } catch (err) {
    console.error('Toggle todo error:', err);
  }
};


  const onLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };



  return (
    <div>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>
      <div className={`App ${isDark ? 'dark' : 'light'}`}>
        <h1>My WishList</h1>
        <div>
          <input value={todo} onChange={onTodoInputChange} placeholder="Add your wishlist here..." />
          <button onClick={onAddtodoClick}>Add</button>
        </div>

        <div>
          {todoList.length > 0 && todoList.map(todo => (
            <div key={todo._id}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() => onTodoCheckChange(todo._id)}
                />
                <span className={todo.isCompleted ? 'strike-through' : ''}>
                  {todo.todo}
                </span>
              </label>
              <button onClick={() => onDeleteClick(todo._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <button onClick={onLogout} className="logout-button">Logout</button>
    </div>
  );
}

export default Wishlist;

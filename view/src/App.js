import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Navigate, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Catalog from './components/Catalog page/Catalog';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/register'/>} />
        <Route path='/register' element={ <Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/catalog' element={<Catalog />}/>
      </Routes>
    </Router>
  );
}

export default App;

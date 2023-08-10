import React from 'react';
import logo from './logo.svg';
import './App.css';
import AuthProvider from './contexts/AuthContext';
import Profile from './components/molecules/Profile';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Profile />
      </AuthProvider>
    </div>
  );
}

export default App;

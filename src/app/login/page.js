"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import supabase from '../../config/supabaseClient.js';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // Call API to authenticate user
      let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      if (error) {
        setError(error);
        console.log('error logging in');
        console.log(error);
      } else {
        // Login successful, redirect to dashboard or next page
        console.log('successful login');
        router.push('/');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error.message}</p>}
      </form>
    </div>
  );
};

export default Login;
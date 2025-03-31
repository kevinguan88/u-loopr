"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import supabase from '../../config/supabaseClient.js';
import { useRouter } from 'next/navigation';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            // Call API to create new user
            let { data, error } = await supabase.auth.signUp({
                email: email,
                password: password
            });
            if (error) {
                setError(data.error);
                console.log(error);
            } else {
                // Sign up successful, redirect to login page
                console.log('successful sign up');
                router.push('/login');
            }
        } catch (error) {
            setError('An error occurred during sign up');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordConfirmation = (event) => {
        if (password !== event.target.value) {
            setError('Passwords do not match');
        } else {
            setError(null);
        }
        setConfirmPassword(event.target.value);
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
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
                <label>
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={handlePasswordConfirmation}
                    />
                </label>
                <br />
                <button type="submit" disabled={isLoading || password !== confirmPassword}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default SignUp;
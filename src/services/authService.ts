/* eslint-disable no-useless-catch */
// src/services/authService.ts
export interface LoginPayload {
  email: string
  password?: string
  googleToken?: string
}

export interface SignupPayload {
  email: string
  password: string
  fullName?: string
  // Add any other signup fields here
}

export async function handleLogin(payload: LoginPayload) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Login failed');
    return await res.json(); // expects { token, user }
  } catch (err) {
    throw err;
  }
}

export async function handleSignup(payload: SignupPayload) {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Signup failed');
    return await res.json(); // expects { token, user }
  } catch (err) {
    throw err;
  }
}

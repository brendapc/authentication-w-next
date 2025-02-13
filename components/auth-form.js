"use client"
import Link from 'next/link';
import { authHelper, signup } from '@/actions/auth-actions';
import { useFormState } from 'react-dom';

export default function AuthForm({ mode }) {
  const [formState, formAction] = useFormState(authHelper.bind(null, mode), {}) //bind 1rst agument is preconfigurations (don't need) 2nd argument is a new param required by authHelper
  return (
    <form id="auth-form" action={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" />
      </p>
      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>
      {
        formState.errors && (<ul id='form-errors'>
          {Object.keys(formState.errors).map((key) => (
            <li key={key}>{formState.errors[key]}</li>
          ))}
        </ul>)
      }
      <p>
        <button type="submit">
          {mode === 'login' ? 'Login' : 'Create Account'}
         </button>
      </p>
      <p>
        {mode === 'login' && <Link href="/?mode=signup">Create an account.</Link> }
        {mode === 'signup' && <Link href="/?mode=login">Login with existing account.</Link> }
      </p>
    </form>
  );
}

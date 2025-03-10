import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js';
import { Eye, EyeOff, Loader2, Mail, MessageSquare, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern.jsx';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn, resendVerificationEmail } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowResend(false);

    // console.log("Submitting form:", formData);
    try {
      await login(formData);
    } catch (error) {
      console.log("Login Error:", error.message);
      if (error.message === "Email not verified. Check your inbox.") {
        setShowResend(true);
        setEmail(formData.email);
        console.log(email)
      }
    }
  }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>

        <div className='w-full max-w-md space-y-8'>
          <div className='text-center mb-8'>
            {/* Logo */}
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Login</h1>
              <p className='text-base-content/60'>Continue Chatting!</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>E-mail</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left- pl-3 flex items-center pointer-events-none'>
                  <Mail className='size-5 text-base-content/40' />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder='john@email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left- pl-3 flex items-center pointer-events-none'>
                  <Lock className='size-5 text-base-content/40' />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder='********'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='size-5 text-base-content/40' />
                  ) : (
                    <Eye className='size-5 text-base-content/40' />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className='btn btn-primary w-full'
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {showResend && (
            <div className='text-center z-40'>
              <p className='text-red-500'>Your email is not verified. Please check you inbox.</p>
              <button className='btn btn-outline mt-2' onClick={() => resendVerificationEmail(email)}>Resend Verification Email</button>
            </div>
          )}
          <div className='text-center'>
            <p className='text-base-content/60'>
              Not registered?{" "}
              <Link to="/signup" className='link link-primary'>SignUp</Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Chat"
        subtitle="Connect with friends, share moments, and stay in touch."
      />
    </div>
  )
}

export default Login
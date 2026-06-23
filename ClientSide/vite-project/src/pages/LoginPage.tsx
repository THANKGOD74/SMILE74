import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState({ email: false, password: false });
  const [loginError, setLoginError] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError({ ...error, [name]: false });
    setLoginError(''); // Clear login error when user types
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous login error
    setLoginError('');

    let hasError = false;
    const newError = { email: false, password: false };

    if (!form.email.trim() || !form.email.includes('@')) {
      newError.email = true;
      hasError = true;
    }
    if (!form.password.trim() || form.password.length < 8) {
      newError.password = true;
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/my-tasks');
    } catch (err: any) {
      // 👇 Get error message from server response
      const errorMsg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setLoginError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-teal-900 mb-6"
        >
          Login
        </motion.h2>

        {/* Login Error Message */}
        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-red-600 text-sm text-center">{loginError}</p>
          </motion.div>
        )}

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
              error.email
                ? 'border-red-500 placeholder-red-500'
                : 'border-gray-300'
            }`}
          />
          {error.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {!form.email.trim()
                ? 'Email cannot be left blank'
                : 'Please enter a valid email address'}
            </motion.p>
          )}
        </motion.div>

        {/* Password with Eye Toggle */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-4"
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password (min 8 chars)"
            value={form.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
              error.password
                ? 'border-red-500 placeholder-red-500'
                : 'border-gray-300'
            }`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-10.75 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          {error.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {!form.password.trim()
                ? 'Password cannot be left blank'
                : 'Password must be at least 8 characters'}
            </motion.p>
          )}
        </motion.div>

        {/* forgotPassword */}
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-teal-600 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </motion.button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-600 font-medium hover:underline">
            Register
          </Link>
        </p>
      </form>
    </motion.div>
  );
};

export default LoginPage;
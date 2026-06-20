import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: false });
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    let hasError = false;
    const newErrors = { name: false, email: false, password: false, confirmPassword: false };

    if (!form.name.trim() || form.name.length < 2) {
      newErrors.name = true;
      hasError = true;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      newErrors.email = true;
      hasError = true;
    }
    if (!form.password.trim() || form.password.length < 8) {
      newErrors.password = true;
      hasError = true;
    }
    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = true;
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/my-tasks');
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Registration failed. Please try again.');
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
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center text-teal-900 mb-6"
        >
          Create Account
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
                errors.name ? 'border-red-500 placeholder-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {!form.name.trim() ? 'Name cannot be left blank' : 'Name must be at least 2 characters'}
              </motion.p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="text"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
                errors.email ? 'border-red-500 placeholder-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {!form.email.trim() ? 'Email cannot be left blank' : 'Please enter a valid email address'}
              </motion.p>
            )}
          </motion.div>

          {/* Password with Eye Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
                errors.password ? 'border-red-500 placeholder-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {!form.password.trim() ? 'Password cannot be left blank' : 'Password must be at least 8 characters'}
              </motion.p>
            )}
          </motion.div>

          {/* Confirm Password with separate Eye Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
                errors.confirmPassword ? 'border-red-500 placeholder-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                Passwords do not match
              </motion.p>
            )}
          </motion.div>

          {/* Server error */}
          {serverError && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm"
            >
              {serverError}
            </motion.p>
          )}

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
                Registering...
              </>
            ) : (
              'Register'
            )}
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterPage;





// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Eye, EyeOff } from 'lucide-react';

// const RegisterPage = () => {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState({
//     name: false,
//     email: false,
//     password: false,
//     confirmPassword: false,
//   });
//   // Separate states for password and confirm password visibility
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [serverError, setServerError] = useState('');
//   const { register } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//     setErrors({ ...errors, [name]: false });
//     setServerError('');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setServerError('');

//     let hasError = false;
//     const newErrors = { name: false, email: false, password: false, confirmPassword: false };

//     if (!form.name.trim() || form.name.length < 2) {
//       newErrors.name = true;
//       hasError = true;
//     }
//     if (!form.email.trim() || !form.email.includes('@')) {
//       newErrors.email = true;
//       hasError = true;
//     }
//     if (!form.password.trim() || form.password.length < 8) {
//       newErrors.password = true;
//       hasError = true;
//     }
//     if (form.confirmPassword !== form.password) {
//       newErrors.confirmPassword = true;
//       hasError = true;
//     }

//     if (hasError) {
//       setErrors(newErrors);
//       return;
//     }

//     try {
//       await register(form.name, form.email, form.password);
//       navigate('/my-tasks');
//     } catch (err: any) {
//       setServerError(err.response?.data?.error || 'Registration failed. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center text-teal-900 mb-6">Create Account</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Your name"
//               value={form.name}
//               onChange={handleChange}
//               className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
//                 errors.name ? 'border-red-500 placeholder-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm mt-1">
//                 {!form.name.trim() ? 'Name cannot be left blank' : 'Name must be at least 2 characters'}
//               </p>
//             )}
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//             <input
//               type="text"
//               name="email"
//               placeholder="you@example.com"
//               value={form.email}
//               onChange={handleChange}
//               className={`w-full px-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
//                 errors.email ? 'border-red-500 placeholder-red-500' : 'border-gray-300'
//               }`}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">
//                 {!form.email.trim() ? 'Email cannot be left blank' : 'Please enter a valid email address'}
//               </p>
//             )}
//           </div>

//           {/* Password with Eye Toggle */}
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               name="password"
//               placeholder="At least 8 characters"
//               value={form.password}
//               onChange={handleChange}
//               className={`w-full px-4 py-2 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
//                 errors.password ? 'border-red-500 placeholder-red-500' : 'border-gray-300'
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//               aria-label={showPassword ? 'Hide password' : 'Show password'}
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {!form.password.trim() ? 'Password cannot be left blank' : 'Password must be at least 8 characters'}
//               </p>
//             )}
//           </div>

//           {/* Confirm Password with separate Eye Toggle */}
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//             <input
//               type={showConfirmPassword ? 'text' : 'password'}
//               name="confirmPassword"
//               placeholder="Confirm your password"
//               value={form.confirmPassword}
//               onChange={handleChange}
//               className={`w-full px-4 py-2 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 transition ${
//                 errors.confirmPassword ? 'border-red-500 placeholder-red-500' : 'border-gray-300'
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//               aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
//             >
//               {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
//             )}
//           </div>

//           {/* Server error */}
//           {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

//           <button
//             type="submit"
//             className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-xl transition duration-200"
//           >
//             Register
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-600 mt-4">
//           Already have an account?{' '}
//           <Link to="/login" className="text-teal-600 font-medium hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
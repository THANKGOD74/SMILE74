import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const EmailVerified = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-teal-900 mb-4">Email Verified! ✅</h2>
        <p className="text-gray-600 mb-6">
          Your email has been successfully verified. You can now log in to your account.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-6 rounded-xl transition"
        >
          Go to Login
        </button>
      </div>
    </motion.div>
  );
};

export default EmailVerified;
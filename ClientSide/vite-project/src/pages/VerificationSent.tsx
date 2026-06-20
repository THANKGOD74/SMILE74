import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const VerificationSent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-teal-900 mb-4">Check Your Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a verification link to your email address. Please click the link to verify your account.
        </p>
        <Link to="/login" className="text-teal-600 font-medium hover:underline">
          Back to Login
        </Link>
      </div>
    </motion.div>
  );
};

export default VerificationSent;
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/authApi';

const VerifyEmailHandler = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Email verified successfully!');
        setTimeout(() => navigate('/email-verified'), 1500);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. The link may have expired.');
      });
  }, [token, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-teal-600 text-xl">Verifying your email...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className={`bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center ${status === 'error' ? 'border-red-500' : 'border-green-500'}`}>
        <h2 className={`text-2xl font-bold ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {status === 'error' ? 'Verification Failed' : 'Verification Successful'}
        </h2>
        <p className="text-gray-600 mt-4">{message}</p>
        {status === 'error' && (
          <button
            onClick={() => navigate('/login')}
            className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-xl"
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailHandler;
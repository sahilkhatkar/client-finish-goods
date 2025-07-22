'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');


  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning('Please enter both email and password');
      setError('Both fields are required');
      return;
    }

    setLoading(true);

    const res = await signIn('credentials', {
      username: email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      toast.error('Invalid username or password');
      setError('Invalid username or password');
    } else if (res?.ok && res?.url) {
      toast.success('Login successful!');
      router.push(res.url);
    } else {
      toast.error('Unexpected error. Try again.');
    }
  };

  return (
    <div className={styles.background}>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        pauseOnHover
        theme="colored"
      />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.icon}>
          <span>🔐</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to IMS
        </motion.h2>

        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
        />

        {error && <p className={styles.error}>{error}</p>}

        {/* <div className={styles.forgot}>
          <button onClick={() => setShowResetModal(true)} className={styles.forgotLink}>
            Forgot password?
          </button>
        </div> */}


        <motion.button
          className={styles.button}
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <span className={styles.spinner}>
              <FaSpinner className={styles.spin} />
              Logging in...
            </span>
          ) : (
            'Get Started'
          )}
        </motion.button>






        </motion.div>
        {showResetModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Reset Password</h3>
              <input
                type="email"
                placeholder="Enter your email"
                className={styles.input}
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <div className={styles.modalActions}>
                <button
                  className={styles.button}
                  onClick={() => {
                    if (!resetEmail) {
                      toast.warning('Please enter your email');
                      return;
                    }
                    // Simulate reset request
                    toast.success('Password reset link sent!');
                    setShowResetModal(false);
                    setResetEmail('');
                  }}
                >
                  Send Reset Link
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowResetModal(false);
                    setResetEmail('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}




    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './style.module.css';

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('');

  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    // Detect current theme from document body or root element
    const detectTheme = () => {
      const body = document.body;
      const classList = Array.from(body.classList);
      const themeClass = classList.find(cls => cls.startsWith('theme-'));
      
      if (themeClass) {
        setCurrentTheme(themeClass);
      } else {
        // Fallback to cyberwave if no theme is detected
        setCurrentTheme('theme-cyberwave');
        body.classList.add('theme-cyberwave');
      }
    };

    detectTheme();

    // Optional: Listen for theme changes
    const observer = new MutationObserver(() => {
      detectTheme();
    });

    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    signOut({ redirect: false }).then(() => {
      router.replace('/login');
    });
  };

  // const handleLogout = async () => {
  //   setIsLoggingOut(true);
    
  //   try {
  //     // Simulate logout API call
  //     await new Promise(resolve => setTimeout(resolve, 2500));
      
  //     // Clear any stored tokens/sessions
  //     if (typeof window !== 'undefined') {
  //       localStorage.removeItem('token');
  //       localStorage.removeItem('user');
  //       sessionStorage.clear();
        
  //       // Clear any cookies if needed
  //       document.cookie.split(";").forEach(cookie => {
  //         const eqPos = cookie.indexOf("=");
  //         const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //         document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  //       });
  //     }
      
  //     // Redirect to login page
  //     router.push('/login');
  //   } catch (error) {
  //     console.error('Logout failed:', error);
  //     // Handle error state if needed
  //     setIsLoggingOut(false);
  //   }
  // };

  return (
    <div className={styles.logoutPage}>
      {!isLoggingOut ? (
        <div className={styles.content}>
          {/* <h1 className={styles.mainHeading}>Wanna Exit?</h1> */}
          <h2 className={styles.subHeading}>Are you sure you want to log out?</h2>
          {/* <p className={styles.description}>
            You're about to sign out of your account. All your progress will be saved, 
            but you'll need to log in again to continue your session.
          </p> */}
          
          <div className={styles.buttonContainer}>
            <button 
              onClick={handleLogout}
              className={styles.btn}
              disabled={isLoggingOut}
              aria-label="Sign out"
            >
              <span>Sign Out</span>
              <svg 
                className={styles.btnIcon} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} aria-hidden="true"></div>
          <h2 className={styles.loadingText}>Signing You Out...</h2>
          <p className={styles.loadingSubtext}>
            Thanks for your time! See you again soon.
          </p>
        </div>
      )}
    </div>
  );
}
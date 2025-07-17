'use client';

import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AnimatedWrapper from '../components/AnimatedWrapper';
import GlobalWrapper from '../components/GlobalDataLoader';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {

  return (
    <GlobalWrapper>
      <div className={styles.dashboardLayout}>
        <Sidebar />
        <div className={styles.mainArea}>
          <Topbar />
          <AnimatedWrapper>{children}</AnimatedWrapper>
        </div>
      </div>
    </GlobalWrapper>
  );
}

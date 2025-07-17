'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import { FaDatabase, FaBoxes } from 'react-icons/fa';
import { FaGear } from "react-icons/fa6";
import { GoGear } from "react-icons/go";
import { AiOutlinePlusCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import { BiTransferAlt } from 'react-icons/bi';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        // { href: '/dashboard/', label: 'Dashboard', icon: <MdDashboard /> },
        { href: '/dashboard/ims', label: 'IMS Master', icon: <FaDatabase /> },
        { href: '/dashboard/live-stock', label: 'Live Stock', icon: <FaBoxes /> },
        { href: '/dashboard/inventory-form', label: 'In - Out', icon: <BiTransferAlt /> },
        { href: '/dashboard/about', label: 'About', icon: <AiOutlineInfoCircle />, spacer: true },
        { href: '/dashboard/settings', label: 'Settings', icon: <GoGear /> },
        // { href: '/dashboard/logout', label: 'Log out', icon: <FiLogOut /> },
    ];

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsOpen(!mobile);
            setIsCollapsed(false); // reset collapse on resize
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <button
                className={styles.toggleButton}
                onClick={() => setIsOpen(prev => !prev)}>
                ☰
            </button>

            {isOpen && (
                <motion.aside
                    initial={{ x: -220, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -220, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
                >
                    <div className={styles.topSection}>
                        <h3 className={styles.logo}>{!isCollapsed && 'Brand FG'}</h3>
                        {/* <button
                            className={styles.collapseBtn}
                            onClick={() => setIsCollapsed(prev => !prev)}
                            title={isCollapsed ? 'Expand' : 'Collapse'}
                        >
                            {isCollapsed ? '➤' : '◀'}
                        </button> */}
                    </div>

                    <nav>
                        {navItems.map(({ href, label, icon, spacer }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`${styles.link} ${pathname === href ? styles.active : ''} ${spacer ? styles.spacer : ''}`}
                            >
                                <span className={styles.icon}>{icon}</span>
                                {!isCollapsed && <span className={styles.text}>{label}</span>}
                            </Link>

                        ))}
                    </nav>
                </motion.aside>
            )}

            {isMobile && isOpen && (
                <div className={styles.overlay} onClick={() => setIsOpen(false)} />
            )}
        </>
    );
}

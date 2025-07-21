'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './StockTable.module.css';
import { useSelector } from 'react-redux';
import { IoIosSearch, IoMdClose, IoMdDownload, IoMdEye } from "react-icons/io";

// Utility functions
const parseDate = (str) => {
    if (!str || typeof str !== 'string') return new Date('Invalid Date');
    const parts = str.split('-');
    if (parts.length !== 3) return new Date('Invalid Date');

    const [day, month, year] = parts;
    return new Date(`${month} ${day}, ${year}`);
};

const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Custom hooks
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default function StockEntriesPage() {
    const { masterData = [] } = useSelector((state) => state.masterData);
    const { formResponses = [] } = useSelector((state) => state.formResponses);

    // State management
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Refs
    const searchInputRef = useRef(null);
    const modalRef = useRef(null);

    // Debounced search term
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    // Memoized calculations
    const allKeys = useMemo(() => {
        if (formResponses.length === 0) return [];

        const keySet = new Set();
        formResponses.forEach((entry) =>
            Object.keys(entry).forEach((key) => keySet.add(key))
        );
        const keys = Array.from(keySet);

        const itemCodeIndex = keys.indexOf('item_code');
        if (itemCodeIndex !== -1) {
            keys.splice(itemCodeIndex, 0, 'description');
        }

        return keys;
    }, [formResponses]);

    const filtered = useMemo(() => {
        if (formResponses.length === 0) return [];

        const reversed = [...formResponses].reverse();
        return reversed.filter((entry) => {
            try {
                const d = parseDate(entry.date);
                const from = startDate ? new Date(startDate) : null;
                const to = endDate ? new Date(endDate) : null;

                const matchesDate = (!from || d >= from) && (!to || d <= to);
                const matchesSearch = !debouncedSearchTerm ||
                    Object.values(entry)
                        .filter(val => val != null)
                        .join(' ')
                        .toLowerCase()
                        .includes(debouncedSearchTerm.toLowerCase());

                return matchesDate && matchesSearch;
            } catch (err) {
                console.warn('Error filtering entry:', entry, err);
                return false;
            }
        });
    }, [formResponses, startDate, endDate, debouncedSearchTerm]);

    const sorted = useMemo(() => {
        if (!sortConfig.key || filtered.length === 0) return filtered;

        return [...filtered].sort((a, b) => {
            try {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];

                if (sortConfig.key === 'stock_qty') {
                    valA = parseFloat(valA) || 0;
                    valB = parseFloat(valB) || 0;
                } else if (sortConfig.key === 'date') {
                    valA = parseDate(valA);
                    valB = parseDate(valB);
                } else if (sortConfig.key === 'timestamp') {
                    valA = new Date(valA);
                    valB = new Date(valB);
                } else {
                    valA = valA?.toString().toLowerCase() || '';
                    valB = valB?.toString().toLowerCase() || '';
                }

                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            } catch (err) {
                console.warn('Error sorting entries:', err);
                return 0;
            }
        });
    }, [filtered, sortConfig]);

    const totalPages = Math.ceil(sorted.length / pageSize);
    const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

    // Event handlers
    const requestSort = useCallback((key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    }, []);

    const handleExport = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const csvData = [
                ['S. No.', ...allKeys],
                ...filtered.map((row, index) =>
                    [
                        `"${index + 1}"`,
                        ...allKeys.map((key) => {
                            if (key === 'description') {
                                const matched = masterData.find((item) => item.item_code === row.item_code);
                                return `"${matched?.description ?? ''}"`;
                            }
                            return `"${row[key] ?? ''}"`;
                        })
                    ].join(',')
                ),
            ].join('\n');

            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.download = `stock-entries-${timestamp}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to export CSV. Please try again.');
            console.error('Export error:', err);
        } finally {
            setLoading(false);
        }
    }, [filtered, allKeys, masterData]);

    const handlePageSizeChange = useCallback((newSize) => {
        setPage(1);
        setPageSize(parseInt(newSize));
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to first page on search
    }, []);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setPage(1);
    }, []);

    const handleRowClick = useCallback((entry) => {
        setSelectedRow(entry);
    }, []);

    const closeModal = useCallback(() => {
        setSelectedRow(null);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        searchInputRef.current?.focus();
                        break;
                    case 'e':
                        e.preventDefault();
                        handleExport();
                        break;
                }
            }
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleExport, closeModal]);

    // Focus management for modal
    useEffect(() => {
        if (selectedRow && modalRef.current) {
            modalRef.current.focus();
        }
    }, [selectedRow]);

    const getCellValue = useCallback((entry, key) => {
        if (key === 'description') {
            const matchedItem = masterData.find((item) => item.item_code === entry.item_code);
            return matchedItem?.description || '—';
        }
        return entry[key];
    }, [masterData]);

    const getCellClassName = useCallback((key, value) => {
        const isQty = key === 'stock_qty';
        const isType = key === 'form_type';

        let className = '';

        if (isQty) {
            className += value < 0 ? styles.negative : styles.positive;
        }

        if (isType) {
            className += value === 'Inward' ? styles.inward : styles.outward;
        }

        if (key === 'remarks') {
            className += ` ${styles.remarksColumn}`;
        }

        return className.trim();
    }, []);

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header>
                <h1 className={styles.heading}>📦 Stock Entries</h1>
                {formResponses.length === 0 && (
                    <p className={styles.emptyState}>No stock entries found. Start by adding some entries.</p>
                )}
            </header>

            <div className={styles.toolbar}>
                <div className={styles.leftControls}>

                    <div className={styles.searchWrapper}>
                        <IoIosSearch className={styles.searchIcon} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search entries... (Ctrl+K)"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={styles.searchInput}
                            aria-label="Search stock entries"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className={styles.clearSearch}
                                aria-label="Clear search"
                            >
                                <IoMdClose />
                            </button>
                        )}
                    </div>

                    <div className={styles.dateRange}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="fromDate">From</label>
                            <input
                                id="fromDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className={styles.animatedInput}
                                aria-label="Start date filter"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="toDate">To</label>
                            <input
                                id="toDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className={styles.animatedInput}
                                aria-label="End date filter"
                                min={startDate}
                            />
                        </div>

                        {(startDate || endDate || searchTerm) && (
                            <button
                                onClick={clearFilters}
                                className={styles.clearFilters}
                                aria-label="Clear all filters"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.rightControls}>
                    <label className={styles.rowsPerPage}>
                        Rows:
                        <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(e.target.value)}
                            aria-label="Rows per page"
                        >
                            {[5, 10, 25, 50, 100].map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </label>

                    <button
                        className={styles.exportBtn}
                        onClick={handleExport}
                        disabled={loading || filtered.length === 0}
                        aria-label="Export to CSV (Ctrl+E)"
                    >
                        {loading ? (
                            <>⏳ Exporting...</>
                        ) : (
                            <>
                                <IoMdDownload />
                                Export CSV
                            </>
                        )}
                    </button>
                </div>
            </div>

            {filtered.length > 0 ? (
                <>
                    <div className={styles.tableWrapper} role="region" aria-label="Stock entries table">
                        <table className={styles.table} role="table">
                            <thead>
                                <tr>
                                    <th scope="col">S. No.</th>
                                    {allKeys.map((key) => (
                                        <th
                                            key={key}
                                            onClick={() => requestSort(key)}
                                            className={styles.sortableHeader}
                                            scope="col"
                                            role="button"
                                            tabIndex={0}
                                            aria-sort={
                                                sortConfig.key === key
                                                    ? sortConfig.direction === 'asc' ? 'ascending' : 'descending'
                                                    : 'none'
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    requestSort(key);
                                                }
                                            }}
                                        >
                                            {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            {sortConfig.key === key && (
                                                <span className={styles.sortIcon}>
                                                    {sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                    <th scope="col" className={styles.actionsColumn}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {paginated.map((entry, i) => (
                                        <motion.tr
                                            key={`${entry.timestamp || 'row'}-${i}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.2, delay: i * 0.05 }}
                                            className={styles.row}
                                            role="row"
                                        >
                                            <td>{(page - 1) * pageSize + i + 1}</td>
                                            {allKeys.map((key) => {
                                                const val = getCellValue(entry, key);
                                                return (
                                                    <td
                                                        key={key}
                                                        className={getCellClassName(key, val)}
                                                        title={key === 'remarks' ? val : undefined}
                                                    >
                                                        {val ?? '-'}
                                                    </td>
                                                );
                                            })}
                                            <td className={styles.actionsColumn}>
                                                <button
                                                    onClick={() => handleRowClick(entry)}
                                                    className={styles.viewBtn}
                                                    aria-label={`View details for entry ${(page - 1) * pageSize + i + 1}`}
                                                >
                                                    <IoMdEye />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.tableFooter}>
                        <div className={styles.entriesInfo}>
                            Showing {paginated.length} of {filtered.length} entries
                            {filtered.length !== formResponses.length && (
                                <span className={styles.filteredInfo}>
                                    (filtered from {formResponses.length} total)
                                </span>
                            )}
                        </div>

                        <nav className={styles.pagination} aria-label="Table pagination">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                aria-label="Go to previous page"
                            >
                                ← Prev
                            </button>
                            <span aria-live="polite">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                                aria-label="Go to next page"
                            >
                                Next →
                            </button>
                        </nav>
                    </div>
                </>
            ) : (
                <div className={styles.emptyResults}>
                    <h3>No entries found</h3>
                    <p>Try adjusting your search criteria or date range.</p>
                </div>
            )}

            <AnimatePresence>
                {selectedRow && (
                    <div
                        className={styles.modalBackdrop}
                        onClick={closeModal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <motion.div
                            ref={modalRef}
                            className={styles.modal}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            tabIndex={-1}
                        >
                            <h2 id="modal-title" className={styles.modalTitle}>
                                📄 Entry Details
                            </h2>
                            <div className={styles.modalContent}>
                                {allKeys.map((key) => {
                                    const value = getCellValue(selectedRow, key);
                                    return (
                                        <div className={styles.modalRow} key={key}>
                                            <span className={styles.modalKey}>
                                                {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </span>
                                            <span className={styles.modalValue}>
                                                {value ?? '-'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                className={styles.closeBtn}
                                onClick={closeModal}
                                aria-label="Close dialog"
                            >
                                <IoMdClose />
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
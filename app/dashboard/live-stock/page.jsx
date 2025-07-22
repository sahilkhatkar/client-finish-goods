'use client';

import { useSelector } from 'react-redux';
import { useState, useMemo } from 'react';
import { FaInfoCircle, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import Select from 'react-select';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../components/imsStyles.module.css';
import InfoModal from '../../components/InfoModal';
// import EditModal from '../../components/EditModal'; // optional

const ITEMS_PER_PAGE = 10;

export default function LiveStockPage() {
  const { sheetData: stockData, loading, error } = useSelector((state) => state.filteredBrand);

  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
  const [selectedItem, setSelectedItem] = useState(null);
  const [infoItem, setInfoItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const columns = useMemo(() => ([
    { key: 'description', label: 'Description', filterable: false },
    { key: 'pack_size', label: 'Pack Size', filterable: true },
    { key: 'hsn_code', label: 'HSN Code', filterable: true },
    { key: 'max_level', label: 'Max Level', filterable: true },
    { key: 'stock_qty', label: 'Stock Qty', filterable: false },
  ]), []);

  const filteredData = useMemo(() => {
    if (!Array.isArray(stockData)) return [];

    return stockData.filter((item) => {
      const matchesSearch = Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (value === 'all') return true;
        return String(item[key]).trim().toLowerCase() === String(value).trim().toLowerCase();
      });

      return matchesSearch && matchesFilters;
    });
  }, [stockData, searchTerm, filters]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a?.[sortConfig.key] ?? '';
      const bValue = b?.[sortConfig.key] ?? '';
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentItems = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const getUniqueValues = (key) => {
    return Array.from(
      new Set((stockData || []).map((item) => item[key]).filter(Boolean))
    ).sort();
  };

  if (loading) return <p style={{ padding: '1rem' }}>Loading...</p>;
  if (error) return <p style={{ padding: '1rem', color: 'red' }}>{error}</p>;

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.tableTitle}>
        Live Stock <span className={styles.liveDot} />
      </h1>

      <div className={styles.searchBarWrapper}>
        <input
          type="text"
          placeholder="Search here..."
          className={styles.searchBar}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className={styles.filters}>
        {columns.filter(col => col.filterable).map((col) => {
          const options = getUniqueValues(col.key).map(val => ({ value: val, label: val }));
          const value = filters[col.key] && filters[col.key] !== 'all'
            ? { value: filters[col.key], label: filters[col.key] }
            : { value: 'all', label: 'All' };

          return (
            <div key={col.key} className={styles.columnFilter}>
              <label>{col.label}</label>
              <Select
                options={[{ value: 'all', label: 'All' }, ...options]}
                value={value}
                onChange={(selected) => {
                  setFilters(prev => ({ ...prev, [col.key]: selected.value }));
                  setCurrentPage(1);
                }}
                isSearchable
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                  control: base => ({
                    ...base,
                    minHeight: '34px',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--card-bg)',
                    borderColor: '#ccc',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#007bff' }
                  }),
                  menu: base => ({
                    ...base,
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text)',
                    zIndex: 9999,
                    fontSize: '0.9rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    ":hover": {
                      color: 'var(--text)',
                    },

                  }),
                  indicatorSeparator: base => ({  ...base, display: 'none' }),
                  
                  singleValue: base => ({
                    ...base,
                    color: 'var(--text)',
                    fontSize: '0.875rem'
                  }),
                }}
              />
            </div>
          );
        })}

        <div className={styles.controls}>
          <div className={styles.rowsPerPage}>
            <label>Rows:</label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[10, 20, 30, 50].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.totalStockQty}>
          <span>Total Stock</span>
          <p>
            {filteredData.reduce((sum, obj) => sum + (Number(obj.stock_qty) || 0), 0)}
          </p>
        </div>
      </div>

      <p className={styles.tableSubTitle}>
        {
          (searchTerm.trim() || Object.values(filters).some(val => val && val !== 'all'))
            ? `Found ${filteredData.length} out of ${stockData.length} items`
            : `Total ${stockData.length} items in stock`
        }
      </p>

      <div className={styles.tableWrapper}>
        <table className={styles.animatedTable}>
          <thead>
            <tr>
              <th>#</th>
              {columns.map((col) => (
                <th key={col.key} onClick={() => handleSort(col.key)}>
                  {col.label} {getSortIcon(col.key)}
                </th>
              ))}
              <th className={styles.actionsCol}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="100%" style={{ textAlign: 'center', padding: '1rem' }}>
                  No results found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr
                  key={item.item_code || index}
                  className={styles.tableRow} // ← Make sure this class doesn't scale on hover
                >
                  <td>{startIndex + index + 1}</td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={col.key === 'description' ? styles.wrap : undefined}
                    >
                      {item[col.key]}
                    </td>
                  ))}
                  <td className={styles.actionsCell}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => setInfoItem(item)}
                      aria-label="Info"
                      title="View Details"
                    >
                      <FaInfoCircle />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className={styles.pageBtn}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className={styles.pageBtn}
          >
            Next
          </button>
        </div>
      </div>

      {selectedItem && (
        <EditModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
      {infoItem && (
        <InfoModal item={infoItem} onClose={() => setInfoItem(null)} />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

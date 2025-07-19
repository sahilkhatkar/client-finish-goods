'use client';

import { useSelector } from 'react-redux';
import Table from './Table';

export default function LiveStockPage() {
  const { sheetData, loading, error } = useSelector((state) => state.filteredBrand);

  console.log('LiveStockPage sheetData:', sheetData);

  if (loading) return <p style={{ padding: '1rem' }}>Loading...</p>;

  if (error) return <p style={{ padding: '1rem', color: 'red' }}>{error}</p>;

  // if (!sheetData.length) {
  //   return <p style={{ padding: '1rem', color: 'red' }}>No data available</p>;
  // }

  return <Table stockData={sheetData} />;
}

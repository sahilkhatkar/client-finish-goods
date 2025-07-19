'use client';
import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import dynamic from 'next/dynamic';
import { addResponseToResponses } from '../../../store/slices/formResponsesSlice';
const Select = dynamic(() => import('react-select'), { ssr: false });

const script_live_stock_url = "https://script.google.com/macros/s/AKfycbxnnkkjOo5tAHHIKwucr6GrB2pBY4S0PrLUFBMwDkPaImpeGuRvFCDadzfAiq-E_LEeag/exec"

export default function InventoryForm() {
    const dispatch = useDispatch();

    const { masterData, loading, error } = useSelector((state) => state.masterData);
    const [isInward, setIsInward] = useState(true);
    const [rows, setRows] = useState([createNewRow()]);
    const [inputValue, setInputValue] = useState('');
    const [formErrors, setFormErrors] = useState([]);
    const filteredOptions = useRef([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });

    function createNewRow() {
        return {
            itemCode: '',
            qty: 1,
            piNumber: '',
            remarks: '',
            description: '',
        };
    }

    const handleToggle = () => {
        setIsInward(!isInward);
        setRows([createNewRow()]);
        setFormErrors([]);
    };

    const handleItemSelect = (index, selectedOption) => {
        const selectedItem = masterData.find(
            (item) => item.item_code === selectedOption?.value
        );

        const updatedRows = [...rows];
        updatedRows[index].itemCode = selectedOption?.value || '';
        updatedRows[index].description = selectedItem?.description || '';
        setRows(updatedRows);
    };

    const handleChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
    };

    const addRow = () => {
        setRows([...rows, createNewRow()]);
        setFormErrors([...formErrors, {}]);
    };

    const removeRow = (index) => {
        const updatedRows = [...rows];
        updatedRows.splice(index, 1);
        setRows(updatedRows.length > 0 ? updatedRows : [createNewRow()]);

        const updatedErrors = [...formErrors];
        updatedErrors.splice(index, 1);
        setFormErrors(updatedErrors.length > 0 ? updatedErrors : [{}]);
    };

    const validateRows = () => {
        const errors = rows.map((row) => {
            const rowErrors = {};
            if (!row.itemCode) rowErrors.itemCode = 'Item code is required';
            if (!row.qty || isNaN(row.qty) || row.qty <= 0) rowErrors.qty = 'Quantity must be > 0';
            return rowErrors;
        });

        const hasErrors = errors.some((e) => Object.keys(e).length > 0);
        setFormErrors(errors);
        return !hasErrors;
    };

    const formatDateForPayload = (dateStr) => {
        const dateObj = new Date(dateStr);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return dateObj.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateRows()) return;

        setIsSubmitting(true);

        const payload = {
            formType: isInward ? 'Inward' : 'Outward',
            date: formatDateForPayload(date),
            entries: rows,
        };

        const flatArray = payload.entries.map(entry => ({
            item_code: entry.itemCode,
            stock_qty: isInward ? entry.qty : -Math.abs(entry.qty),
            pi_number: entry.piNumber,
            remarks: entry.remarks,
            form_type: payload.formType,
            date: payload.date,
            timestamp: new Date().toLocaleString('en-GB').replace(',', ''),
        }));

        try {
            const response = await fetch('/api/form-responses-stock-data', {
                method: 'POST',
                body: JSON.stringify({ items: flatArray }),
            });

            console.log(flatArray, "Flat Array");

            if (response.ok) {
                toast.success('Inventory submitted successfully!');
                dispatch(addResponseToResponses(flatArray));
                setRows([createNewRow()]);
                setFormErrors([]);
            } else {
                toast.error('Failed to submit inventory');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error submitting inventory');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (error) return <div className={styles.error}>Error: {error}</div>;

    const allItemOptions = masterData?.map((item) => ({
        value: item.item_code,
        label: `${item.description} - ${item.item_code}`,
    }));

    return (
        <form
            className={`${styles.inventoryContainer} ${isSubmitting ? styles.submitting : ''}`}
            onSubmit={handleSubmit}
        >
            <div className={styles.switchAndDate}>
                <h2 className={styles.heading}>
                    <div className={styles.toggleWrapper}>
                        <label className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={isInward}
                                onChange={handleToggle}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                    <span className={`${styles.subheading} ${isInward ? styles.inward : styles.outward}`}>
                        [ {isInward ? 'Inward' : 'Outward'} ]
                    </span>
                </h2>

                <div className={styles.datePickerWrapper}>
                    <label className={styles.dateLabel}>
                        Date:
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={styles.dateInput}
                            required
                        />
                    </label>
                </div>
            </div>

            <motion.div
                key={isInward ? 'inward' : 'outward'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={styles.tableWrapper}
            >
                <table className={styles.inventoryTable}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th className={styles.itemCodeCol}>
                                Item<span className={styles.required}>*</span>
                            </th>
                            <th className={styles.midWidth}>
                                Qty<span className={styles.required}>*</span>
                            </th>
                            <th className={styles.piNumberCol}>
                                PI No.
                            </th>
                            <th className={styles.midWidth}>Remarks</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <Select
                                        className={styles.reactSelect}
                                        placeholder="Select item code..."
                                        value={
                                            row.itemCode
                                                ? {
                                                    value: row.itemCode,
                                                    label: allItemOptions.find(opt => opt.value === row.itemCode)?.label || row.itemCode
                                                }
                                                : null
                                        }
                                        options={filteredOptions.current}
                                        filterOption={null}
                                        onInputChange={(value) => {
                                            setInputValue(value);
                                            filteredOptions.current = allItemOptions
                                                .filter(option => option.label.toLowerCase().includes(value.toLowerCase()))
                                                .slice(0, 30);
                                        }}
                                        onChange={(selected) => handleItemSelect(index, selected)}
                                        isClearable
                                    />
                                    {row.description && (
                                        <div className={styles.itemDescription}>{row.description}</div>
                                    )}
                                    {formErrors[index]?.itemCode && (
                                        <div className={styles.errorMsg}>{formErrors[index].itemCode}</div>
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        value={row.qty}
                                        onChange={(e) => handleChange(index, 'qty', e.target.value)}
                                    />
                                    {formErrors[index]?.qty && (
                                        <div className={styles.errorMsg}>{formErrors[index].qty}</div>
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.piNumber}
                                        onChange={(e) => handleChange(index, 'piNumber', e.target.value)}
                                        placeholder="Enter PI No."
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.remarks}
                                        onChange={(e) => handleChange(index, 'remarks', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        onClick={() => removeRow(index)}
                                        disabled={rows.length === 1}
                                        className={styles.removeBtn}
                                    >
                                        ✖
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            <div className={styles.actionButtons}>
                <button type="button" onClick={addRow} className={styles.addBtn}>
                    Add Row
                </button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <span className={styles.spinner}></span> Submitting...
                        </>
                    ) : (
                        'Submit'
                    )}
                </button>
            </div>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </form>
    );
}

// GlobalWrapper.jsx
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import { setSheetData } from '../../store/slices/masterDataSlice';
import { setFormResponses } from '../../store/slices/formResponsesSlice';


export default function GlobalWrapper({ children }) {

    const dispatch = useDispatch();

    const { masterData } = useSelector((state) => state.masterData);
    const { formResponses } = useSelector((state) => state.formResponses);

    // const { allCredentials } = useSelector((state) => state.data);
    const { sheetData } = useSelector((state) => state.filteredBrand);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status !== 'authenticated' || !session?.user?.brand) return;

        const fetchMasterData = async () => {
            try {
                const res = await fetch(`/api/master-data`);
                if (!res.ok) throw new Error('Failed to fetch data');

                const data = await res.json();
                const filteredData = data.filter((row) =>
                    row.brand?.toLowerCase() === session.user.brand.toLowerCase()
                );

                console.log('Fetched master data:', filteredData);
                dispatch(setSheetData(filteredData));

                // ✅ After setting masterData, extract item_codes for filtering formResponses
                const brandItemCodes = filteredData.map(row => row.item_code);

                // 🟡 Now fetch formResponses and filter them based on brandItemCodes
                const resForm = await fetch(`/api/form-responses-stock-data`);
                if (!resForm.ok) throw new Error('Failed to fetch form responses');

                const formData = await resForm.json();

                // ✅ Filter form responses based on item_codes in masterData
                const filteredFormData = formData.filter(response =>
                    brandItemCodes.includes(response.item_code)
                );

                console.log('Filtered form responses:', filteredFormData);
                dispatch(setFormResponses(filteredFormData));

            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        // Only fetch if masterData not yet fetched
        if (masterData.length === 0)
            fetchMasterData();


    }, [dispatch, session?.user?.brand, status]);

    return <>{children}</>;
}




// || Code for custom brand to fetch data for that ||
// const fetchData = async (brand) => {
//     try {
//         const res = await fetch(`/api/fetch-sheet-data?brand=${encodeURIComponent(session?.user?.brand)}`);
//         if (!res.ok) throw new Error('Failed to fetch data');

//         const data = await res.json();
//         console.log('Fetched sheet data:', data);

//         dispatch(setSheetData(data));

//     } catch (err) {
//         console.error('Error fetching sheet data:', err);
//     }
// };

// // console.log('Session brand:', session.user.brand);
// fetchData();

// if (!allCredentials)
//     dispatch(fetchMasterData());

// console.log("Session from GloablDataLoader:", session.user);
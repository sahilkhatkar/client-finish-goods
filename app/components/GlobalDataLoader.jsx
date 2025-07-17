// GlobalWrapper.jsx
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMasterData } from '../../store/slices/gSheetData';
// import { setSheetData } from '../../store/slices/filteredItemsSlice';
import { setSheetData } from '../../store/slices/masterDataSlice';
import { useSession } from 'next-auth/react';

export default function GlobalWrapper({ children }) {
    const dispatch = useDispatch();

    const { masterData } = useSelector((state) => state.masterData);

    const { allCredentials } = useSelector((state) => state.data);
    const { sheetData } = useSelector((state) => state.filteredBrand);

    const { data: session, status } = useSession();

    useEffect(() => {
        // ✅ Only proceed if the session is fully loaded and brand exists
        if (status !== 'authenticated' || !session?.user?.brand) return;

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

        // if (!allCredentials) {
        //     dispatch(fetchMasterData());
        // }







        const fetchMasterData = async () => {
            try {
                const res = await fetch(`/api/master-data`);
                if (!res.ok) throw new Error('Failed to fetch data');

                const data = await res.json();


                const filteredData = data.filter((row) =>
                  row.brand?.toLowerCase() === session?.user?.brand?.toLowerCase()
                );

                dispatch(setSheetData(filteredData));

            } catch (err) {
                console.error('Error fetching sheet data:', err);
            }
        };

        console.log(masterData.length, "Master Data Length");
        if (masterData.length === 0) {
            fetchMasterData();
        }


        // Optional: Dispatch this only when brand is confirmed
        // dispatch(fetchSheetData(session.user.brand));

    }, [dispatch, allCredentials, session?.user?.brand, status]);

    return <>{children}</>;
}

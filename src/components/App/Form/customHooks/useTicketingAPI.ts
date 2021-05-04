/* eslint-disable prettier/prettier */
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useFormContext } from 'globalState';
import axios from 'axios';
// Import contexts

interface IError {
  title: string;
  message: string;
  isTimeoutError?: boolean;
}

const useTicketingAPI = (apiPath: string) => {
  // State variables
  const [results, setResults] = useState<any>([]);
  const [loading, setLoading] = useState(false); // Set loading state for spinner
  const [errorInfo, setErrorInfo] = useState<IError | null>(null); // Placeholder to set error messaging
  const [formState] = useFormContext();
  const { ticketInfo } = formState;

  // Initial api query (to bring back as many results a possible)
  const ticketQuery: any = useMemo(() => {
    return {
      allowBus: ticketInfo.modes!.includes('bus'),
      allowMetro: ticketInfo.modes!.includes('tram'),
      allowTrain: ticketInfo.modes!.includes('train'),
    };
  }, [ticketInfo]);

  // const ticketFilter: any = useMemo(() => {
  //   let query = {
  //     allowBus: ticketInfo.modes!.includes('bus'),
  //     allowMetro: ticketInfo.modes!.includes('tram'),
  //     allowTrain: ticketInfo.modes!.includes('train'),
  //     allowPeakTravel: ticketInfo.travelTime === 'peak' || ticketInfo.travelTime === 'senior',
  //     // passengerType: ticketInfo.traveller,
  //     isAdult: ticketInfo.traveller === 'adult',
  //     isChild: ticketInfo.traveller === 'youngPerson',
  //     isStudent: ticketInfo.traveller === 'student',
  //     isConcessionary: ticketInfo.traveller === 'concessionary',
  //     isFamily: ticketInfo.traveller === 'family',
  //     timePeriod1: ticketInfo.travelTime === 'peak' || ticketInfo.travelTime === 'senior',
  //     timePeriod2: ticketInfo.travelTime !== 'senior',
  //     timePeriod3: ticketInfo.travelTime !== 'senior',
  //     timePeriod4: ticketInfo.travelTime !== 'senior',
  //   };

  //   // INCLUDES BUS ONLY
  //   const busQuery = {
  //     busTravelArea: ticketInfo.busArea,
  //     operator: ticketInfo.busCompany || 'Network West Midlands',
  //   };

  //   const trainQuery = {
  //     firstClass: ticketInfo.firstClass === 'yes',
  //     networkTicket: ticketInfo.ticketType === 'nTicket',
  //     railZoneFrom: (ticketInfo.railZones && Math.min(...ticketInfo.railZones)) || null,
  //     railZoneTo:
  //       (!ticketInfo.outOfCounty && ticketInfo.railZones && Math.max(...ticketInfo.railZones)) ||
  //       null,
  //     outOfCounty: ticketInfo.outOfCounty,
  //   };

  //   if (ticketInfo.modes?.includes('bus')) {
  //     query = { ...query, ...busQuery };
  //   }

  //   if (ticketInfo.modes?.includes('train')) {
  //     query = { ...query, ...trainQuery };
  //   }

  //   return query;
  // }, [ticketInfo]);

  // Reference variables
  const mounted = useRef<any>();
  const source = useRef<any>();
  const apiTimeout = useRef<any>();
  // Helper functions
  const cancelRequest = () => {
    if (source.current) source.current.cancel('Api request timeout');
  };

  const startApiTimeout = useCallback(() => {
    apiTimeout.current = setTimeout(() => {
      cancelRequest();
    }, 15000); // 15 seconds
  }, []);

  const clearApiTimeout = () => clearTimeout(apiTimeout.current);

  const handleAutoCompleteApiResponse = useCallback((response) => {
    //     console.log({ ticketFilter });
    //     setLoading(false); // Set loading state to false after data is received

    //     const filteredResults = response.data.filter((result: any) => {
    //       // check if each result value matches the equivalent query value
    //       const valuesMatch = () => {
    //         // console.log(`%c${result.name}`, 'font-weight: bold');
    //         let test = true;
    //         // loop through each query key
    //         Object.keys(ticketFilter).forEach((key) => {
    //           let isMatch = result[key] === ticketFilter[key];
    //           if (ticketFilter[key] === null || (ticketFilter[key] === undefined && test)) {
    //             isMatch = true;
    //           }
    //           if (isMatch === false) {
    //             console.log(isMatch);
    //             // console.log(`R: '${result[key]}',`, `Q: '${ticketFilter[key]}',`, `name: ${key}`);
    //             test = false; // fail test if values don't match
    //           }
    //         });
    //         return test;
    //       };

    //       return valuesMatch();
    //     });
    //     console.log(filteredResults);
    setResults(response.data);

    //     if (!filteredResults.length && mounted.current) {
    //       setErrorInfo({
    //         title: 'No results found',
    //         message: 'Make sure you are looking for the right service, and try again.',
    //       });
    //     }
  }, []);

  const handleAutoCompleteApiError = (error: any) => {
    setLoading(false); // Set loading state to false after data is received
    setErrorInfo({
      // Update error message
      title: 'Please try again',
      message: 'Apologies, we are having technical difficulties.',
      isTimeoutError: axios.isCancel(error),
    });
    setResults([]); // Reset the results so that the dropdown disappears
    if (!axios.isCancel(error)) {
      // eslint-disable-next-line no-console
      console.log({ error });
    }
  };

  // Take main function out of useEffect, so it can be called elsewhere to retry the search
  const getAutoCompleteResults = useCallback(() => {
    source.current = axios.CancelToken.source();
    mounted.current = true; // Set mounted to true (used later to make sure we don't do events as component is unmounting)
    const { REACT_APP_API_HOST, REACT_APP_API_KEY } = process.env; // Destructure env vars
    setLoading(true); // Update loading state to true as we are hitting API
    startApiTimeout();
    axios
      .post(REACT_APP_API_HOST + apiPath, ticketQuery, {
        headers: {
          'Ocp-Apim-Subscription-Key': REACT_APP_API_KEY,
        },
        cancelToken: source.current.token, // Set token with API call, so we can cancel this call on unmount
      })
      .then(handleAutoCompleteApiResponse)
      .catch(handleAutoCompleteApiError);
  }, [apiPath, handleAutoCompleteApiResponse, ticketQuery, startApiTimeout]);

  useEffect(() => {
    getAutoCompleteResults();
    // Unmount / cleanup
    return () => {
      mounted.current = false; // Set mounted back to false on unmount
      cancelRequest(); // cancel the request
      clearApiTimeout(); // clear timeout
    };
  }, [getAutoCompleteResults]);

  return { loading, errorInfo, results, ticketQuery, getAutoCompleteResults };
};

export default useTicketingAPI;

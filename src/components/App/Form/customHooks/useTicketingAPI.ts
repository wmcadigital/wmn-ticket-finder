/* eslint-disable prettier/prettier */
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
// Import contexts
import { useFormContext } from 'globalState';
import axios from 'axios';

interface IError {
  title: string;
  message: string;
  isTimeoutError?: boolean;
}

const useTicketingAPI = (apiPath: string = '/ticketing/v2/tickets/search', get?: boolean) => {
  // State variables
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Set loading state for spinner
  const [errorInfo, setErrorInfo] = useState<IError | null>(null); // Placeholder to set error messaging
  const [formState, formDispatch] = useFormContext();
  const { ticketInfo } = formState;

  // Initial api query (to bring back as many results a possible)
  const ticketQuery: any = useMemo(() => {
    // Include stations if stations have been added and an out of county station is selected
    const stations =
      ticketInfo.outOfCounty && ticketInfo.stations ? ticketInfo.stations.split(',') : null;
    return {
      allowBus: ticketInfo.modes?.includes('bus'),
      allowMetro: ticketInfo.modes?.includes('tram'),
      allowTrain: ticketInfo.modes?.includes('train'),
      ...(stations && { stationNames: stations }),
    };
  }, [ticketInfo]);

  // Reference variables
  const mounted = useRef<any>();
  const source = useRef<any>();
  const apiTimeout = useRef<any>();
  // Helper functions
  const cancelRequest = () => {
    if (source.current) source.current.cancel('Api request timeout');
  };

  // on Results
  useEffect(() => {
    formDispatch({ type: 'ADD_API_RESULTS', payload: results });
  }, [formDispatch, results]);

  const startApiTimeout = useCallback(() => {
    apiTimeout.current = setTimeout(() => {
      cancelRequest();
    }, 15000); // 15 seconds
  }, []);

  const clearApiTimeout = () => clearTimeout(apiTimeout.current);

  const handleTicketingApiResponse = useCallback((response) => {
    setResults(response.data);
    setLoading(false);
  }, []);

  const handleTicketingApiError = (error: any) => {
    setLoading(false); // Set loading state to false after data is received
    setErrorInfo({
      // Update error message
      title: 'Please try again',
      message: 'Apologies, we are having technical difficulties.',
      isTimeoutError: axios.isCancel(error),
    });
    setResults([]); // Reset the results
    if (!axios.isCancel(error)) {
      // eslint-disable-next-line no-console
      console.log({ error });
    }
  };

  // Take main function out of useEffect, so it can be called elsewhere to retry the search
  const getAPIResults = useCallback(() => {
    source.current = axios.CancelToken.source();
    mounted.current = true; // Set mounted to true (used later to make sure we don't do events as component is unmounting)
    const { REACT_APP_API_HOST, REACT_APP_API_KEY } = process.env; // Destructure env vars
    setLoading(true); // Update loading state to true as we are hitting API
    startApiTimeout();
    const options = {
      headers: {
        'Ocp-Apim-Subscription-Key': REACT_APP_API_KEY,
      },
      cancelToken: source.current.token, // Set token with API call, so we can cancel this call on unmount
    };

    if (get) {
      axios
        .get(REACT_APP_API_HOST + apiPath, options)
        .then((res) => mounted.current && handleTicketingApiResponse(res))
        .catch(handleTicketingApiError);
    } else {
      axios
        .post(REACT_APP_API_HOST + apiPath, ticketQuery, options)
        .then((res) => mounted.current && handleTicketingApiResponse(res))
        .catch(handleTicketingApiError);
    }
  }, [get, apiPath, handleTicketingApiResponse, ticketQuery, startApiTimeout]);

  useEffect(() => {
    // Unmount / cleanup
    return () => {
      mounted.current = false; // Set mounted back to false on unmount
      cancelRequest(); // cancel the request
      clearApiTimeout(); // clear timeout
    };
  }, []);

  return { loading, errorInfo, results, ticketQuery, getAPIResults };
};

export default useTicketingAPI;

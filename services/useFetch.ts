import { useEffect, useState } from "react";

export const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {

    const [data,setData] = useState<T | null>(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<Error | null>(null)


    const fetchData = async () => {
    try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction();
        setData(result);
    } catch (error) {
        console.log("useFetch error:", error);
        // @ts-ignore
        setError(error instanceof Error ? error : new Error('An unknown error   occurred'));
    }finally{
        setLoading(false);
    }   
    }

    // return data, loading, error and fetchData function
    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
    }

    useEffect(() => {
        if(autoFetch){
            fetchData();
        }
    }, []);

    return { data, loading, error, refetch: fetchData, reset };
}
import axios, { AxiosError, CancelToken } from "axios";
import { useEffect, useState } from "react"
type AsyncFunction<T> = (options:{cancelToken:CancelToken}) => Promise<T>
type AsyncResult<T>={
    data: T | null;
    error: string;
    loading:boolean
}
const useFetch = <T>(asyncFunction:AsyncFunction<T>) :AsyncResult<T>=>{
const [data,setData] =  useState<T | null>(null)
const [loading,setLoading] = useState<boolean>(true)
const [error,setError] = useState<string>("")

useEffect(()=>{
    let unmounted = false;
    let cancelToken = axios.CancelToken.source();
    (async()=>{
        try {
            const res : T = await asyncFunction({cancelToken:cancelToken.token});
            if(!unmounted){
                setData(res)
                setError("")
                setLoading(false)
            }
        } catch (error:any) {
            if(!unmounted){
                if(axios.isCancel(error)){
                    setError("Request cancelled")
                }else{
                    setError((error as AxiosError).message || "An error occurred")
                }
                setLoading(false)
                setData(null)
            }
        }
    })()
    return ()=>{
        unmounted = true
        cancelToken.cancel("Cancelled in cleanup")
    }
},[])
return {
    data,
    error,
    loading
}
}
export default useFetch
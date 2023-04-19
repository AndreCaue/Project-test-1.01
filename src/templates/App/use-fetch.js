import { useEffect, useRef, useState } from "react";

export const isObjectEqual = (ObjA, ObjB) => {
  return JSON.stringify(ObjA) === JSON.stringify(ObjB);
};

export const useFetch = (url, options) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const urlRef = useRef(url);
  const optionsRef = useRef(options);

  useEffect(() => {
    let changed = false;

    if (!isObjectEqual(url, urlRef.current)) {
      urlRef.current = url;
      changed = true;
    }
    if (!isObjectEqual(options, optionsRef.current)) {
      optionsRef.current = options;
      changed = true;
    }

    if (changed) {
      setShouldLoad((s) => !s)
    }
  }, [url, options])

  useEffect(() => {
    let wait = false;
    setLoading(true)

    const fetchData = async () => {
      await new Promise(r => setTimeout(r, 1000));

      try {
        const response = await fetch(urlRef.current, optionsRef.current);
        const jsonResult = await response.json();
        if (!wait) {
          setResult(jsonResult);
          setLoading(false);
        }
      } catch (e) {
        if (!wait) {
          setLoading(false);
        }
        throw e;
      }
    }
    fetchData();

    return () => {
      wait = true;
    }
  }, [shouldLoad])

  return [result, loading];

};

import { useCallback, useEffect, useState } from "react";

const useAsync = (asyncFunction, shouldRun) => {
  const [result, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');

  const run = useCallback(() => {
    setResults(null);
    setError(null);
    setStatus('pending');

    return asyncFunction().then(response => {
      setResults(response);
      setStatus('settled')
    }).catch((error) => {
      setError(error);
      setStatus('error');
    })
  }, [asyncFunction]);
  useEffect(() => {
    if (shouldRun) {
      run();
    }
  }, [run, shouldRun]);

  return [run, result, error, status];
}

const fetchData = async () => {
  const data = await fetch('https://jsonplaceholder.typicode.com/posts/');
  const json = data.json();
  return json
}

const Home = () => {
  //eslint-disable-next-line
  const [posts, setPosts] = useState(null);
  //eslint-disable-next-line
  const [reFetchData, result, error, status] = useAsync(fetchData, true)
  if (status === 'idle') {
    return (<pre>Nada executando</pre>)
  }
  if (status === 'pending') {
    return <pre>Loading...</pre>
  }
  if (status === 'error') {
    return (
      <pre>{JSON.stringify(error, null, 2)}</pre>
    )
  }
  if (status === 'settled') {
    return (
      <pre>{JSON.stringify(result, null, 2)}</pre>
    )
  }

}

export default Home;


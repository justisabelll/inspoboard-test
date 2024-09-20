import { useState } from 'react';
import { Button } from '@/components/ui/button';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex justify-center space-x-4 mb-6">
        <a
          href="https://vitejs.dev"
          target="_blank"
          className="transition-transform transform hover:scale-105"
        >
          <img src="/vite.svg" alt="Vite logo" className="h-12 w-12" />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          className="transition-transform transform hover:scale-105"
        >
          <img
            src="src/assets/react.svg"
            alt="React logo"
            className="h-12 w-12"
          />
        </a>
      </div>
      <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-4">
        Vite + React + ShadCN
      </h1>
      <div className="card p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <Button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          count is {count}
        </Button>
        <p className="mt-2 text-center text-gray-700">
          Edit <code className="font-mono text-blue-500">src/App.tsx</code> and
          save to test HMR
        </p>
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

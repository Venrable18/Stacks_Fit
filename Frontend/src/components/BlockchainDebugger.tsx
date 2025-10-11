import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Clipboard,
  Database
} from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';

interface QueryResult {
  function: string;
  parameters: any;
  result: any;
  timestamp: Date;
  status: 'success' | 'error' | 'loading';
  error?: string;
}

export const BlockchainDebugger: React.FC = () => {
  const { userAddress } = useStacksStore();
  
  const [selectedFunction, setSelectedFunction] = useState('get-dashboard-data-v2');
  const [inputAddress, setInputAddress] = useState('');
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const CONTRACT_ADDRESS = 'STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E';
  const CONTRACT_NAME = 'stacksfit-v2';
  const API_BASE = 'https://api.testnet.hiro.so/v2/contracts/call-read';

  const readFunctions = [
    {
      name: 'get-dashboard-data-v2',
      label: '📊 Dashboard Data V2',
      description: 'Get comprehensive user dashboard data',
      parameters: ['user: principal'],
      requiresAddress: true,
      requiresDate: false
    },
    {
      name: 'get-user-profile',
      label: '👤 User Profile',
      description: 'Get user profile information',
      parameters: ['user: principal'],
      requiresAddress: true,
      requiresDate: false
    },
    {
      name: 'get-current-date',
      label: '📅 Current Date',
      description: 'Get blockchain current date',
      parameters: [],
      requiresAddress: false,
      requiresDate: false
    }
  ];

  useEffect(() => {
    if (userAddress && !inputAddress) {
      setInputAddress(userAddress);
    }
  }, [userAddress, inputAddress]);

  const addressToHex = (address: string): string => {
    if (!address) return '';
    if (address.startsWith('ST') || address.startsWith('SP')) {
      const bytes = new TextEncoder().encode(address);
      return '0x' + Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }
    return address.startsWith('0x') ? address : '0x' + address;
  };

  const executeQuery = async () => {
    if (!selectedFunction) return;
    
    const func = readFunctions.find(f => f.name === selectedFunction);
    if (!func) return;

    if (func.requiresAddress && !inputAddress) {
      alert('Address is required for this function');
      return;
    }

    setIsLoading(true);

    try {
      const args = [];
      if (func.requiresAddress) {
        args.push(addressToHex(inputAddress));
      }

      const response = await fetch(`${API_BASE}/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/${selectedFunction}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: inputAddress || 'STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E',
          arguments: args
        })
      });

      const result = await response.json();

      const queryResult: QueryResult = {
        function: selectedFunction,
        parameters: { address: inputAddress, args: args },
        result: result,
        timestamp: new Date(),
        status: response.ok ? 'success' : 'error',
        error: response.ok ? undefined : result.error || 'Unknown error'
      };

      setQueryResults(prev => [queryResult, ...prev.slice(0, 9)]);

    } catch (error) {
      const queryResult: QueryResult = {
        function: selectedFunction,
        parameters: { address: inputAddress },
        result: null,
        timestamp: new Date(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Network error'
      };

      setQueryResults(prev => [queryResult, ...prev.slice(0, 9)]);
    }

    setIsLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatResult = (result: any) => {
    if (typeof result === 'string') return result;
    return JSON.stringify(result, null, 2);
  };

  const selectedFunc = readFunctions.find(f => f.name === selectedFunction);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          🔗 Blockchain Records Query
        </h2>
        <p className="text-gray-300">Query real data from StacksFit V2 smart contract</p>
      </div>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Contract Address:</span>
            <span className="text-blue-400 ml-2 font-mono">{CONTRACT_ADDRESS}</span>
          </div>
          <div>
            <span className="text-gray-400">Contract Name:</span>
            <span className="text-green-400 ml-2">{CONTRACT_NAME}</span>
          </div>
        </div>
      </div>

      <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Query Builder
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Select Read Function</label>
            <select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white"
            >
              {readFunctions.map((func) => (
                <option key={func.name} value={func.name} className="bg-gray-800">
                  {func.label}
                </option>
              ))}
            </select>
          </div>

          {selectedFunc && selectedFunc.requiresAddress && (
            <div>
              <label className="block text-white font-medium mb-2">
                User Address <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
                placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400"
              />
            </div>
          )}

          <button
            onClick={executeQuery}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Querying Blockchain...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Execute Query
              </>
            )}
          </button>
        </div>
      </div>

      {queryResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Database className="w-5 h-5" />
            Query Results
          </h3>

          {queryResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border backdrop-blur-md ${
                result.status === 'success' 
                  ? 'bg-green-500/10 border-green-500/20' 
                  : 'bg-red-500/10 border-red-500/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    {result.function}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {result.timestamp.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(formatResult(result.result))}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Clipboard className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-1">
                  {result.status === 'success' ? 'Result:' : 'Error:'}
                </h5>
                <div className="bg-black/20 p-3 rounded-lg max-h-64 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap">
                    {result.status === 'success' 
                      ? formatResult(result.result)
                      : result.error || 'Unknown error'
                    }
                  </pre>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

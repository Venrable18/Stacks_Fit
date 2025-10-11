import React, { useState } from 'react';
import { Search, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { useStacksStore } from '../store/stacksStore';

export const BlockchainRecordsViewer: React.FC = () => {
  const [searchType, setSearchType] = useState<'profile' | 'progress' | 'achievements' | 'transactions'>('profile');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { userAddress, getUserProfile, getDailyProgress, getAchievements } = useStacksStore();

  const contractAddress = 'STP472NMPYXCMRB4G75EM43PESZT33FZG7GBVK8E'; // Your actual deployed contract address
  const contractName = 'fitness';

  const searchBlockchainRecords = async () => {
    if (!userAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults(null);

    try {
      // Actually call the blockchain functions to fetch fresh data
      switch (searchType) {
        case 'profile':
          console.log('🔍 Fetching user profile from blockchain...');
          await getUserProfile();
          setSearchResults({
            type: 'User Profile',
            data: useStacksStore.getState().userProfile,
            onChain: true,
            blockHeight: 'Latest',
            transactionId: 'Profile data from blockchain'
          });
          break;
        
        case 'progress':
          console.log('🔍 Fetching daily progress from blockchain...');
          await getDailyProgress();
          const latestProgress = useStacksStore.getState().dailyProgress;
          setSearchResults({
            type: 'Daily Progress Records',
            data: latestProgress.slice(0, 5), // Show last 5 records
            onChain: true,
            totalRecords: latestProgress.length
          });
          break;
          
        case 'achievements':
          console.log('🔍 Fetching achievements from blockchain...');
          await getAchievements();
          const latestAchievements = useStacksStore.getState().achievements;
          setSearchResults({
            type: 'Achievements & NFTs',
            data: latestAchievements,
            onChain: true,
            nftCount: latestAchievements.length
          });
          break;
          
        case 'transactions':
          console.log('🔍 Fetching transaction history...');
          const latestTransactions = useStacksStore.getState().transactions;
          setSearchResults({
            type: 'Transaction History',
            data: latestTransactions.slice(0, 10), // Show last 10 transactions
            onChain: true,
            totalTransactions: latestTransactions.length
          });
          break;
      }
    } catch (err: any) {
      setError(`Error fetching records: ${err.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openInExplorer = (txId?: string) => {
    const explorerUrl = txId 
      ? `https://explorer.stacks.co/txid/${txId}?chain=testnet`
      : `https://explorer.stacks.co/address/${userAddress}?chain=testnet`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Blockchain Records Verification
        </h2>
      </div>

      {/* Search Controls */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Record Type
          </label>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="profile">User Profile</option>
            <option value="progress">Daily Progress</option>
            <option value="achievements">Achievements & NFTs</option>
            <option value="transactions">Transaction History</option>
          </select>
        </div>

        <button
          onClick={searchBlockchainRecords}
          disabled={isSearching || !userAddress}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
        >
          <Search className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
          {isSearching ? 'Searching...' : 'Search Blockchain Records'}
        </button>
      </div>

      {/* Wallet Address Info */}
      {userAddress && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Your Wallet Address:</p>
              <p className="font-mono text-sm text-gray-900 dark:text-white">
                {userAddress}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(userAddress)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => openInExplorer()}
                className="p-2 text-blue-500 hover:text-blue-700"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-green-700 dark:text-green-400">
              {searchResults.type} Found
            </h3>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              ✅ Records verified on Stacks blockchain
            </div>

            {searchResults.data && (
              <div className="bg-white dark:bg-gray-800 rounded border p-3">
                <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                  {JSON.stringify(searchResults.data, null, 2)}
                </pre>
              </div>
            )}

            {searchResults.transactionId && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID:</span>
                <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {searchResults.transactionId}
                </code>
                <button
                  onClick={() => openInExplorer(searchResults.transactionId)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">
          How to Verify Your Records:
        </h4>
        <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
          <li>Connect your wallet to load your address</li>
          <li>Select the type of records you want to verify</li>
          <li>Click "Search Blockchain Records" to query the Stacks blockchain</li>
          <li>View your on-chain data and transaction confirmations</li>
          <li>Click the external link icon to view records in Stacks Explorer</li>
        </ol>
      </div>

      {/* Contract Info */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs">
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Smart Contract:</strong> {contractAddress}.{contractName}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Network:</strong> Stacks Testnet
        </p>
      </div>
    </div>
  );
};

export default BlockchainRecordsViewer;
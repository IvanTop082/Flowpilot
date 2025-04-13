import { ArrowUp, ArrowDown } from 'lucide-react';

interface LiquidityPoolCardProps {
  poolName: string;
  token1: string;
  token2: string;
  balance: string;
  apr: string;
  aprChange: number;
  ilRisk: 'Low' | 'Medium' | 'High';
  recommendation?: string;
}

const LiquidityPoolCard = ({
  poolName,
  token1,
  token2,
  balance,
  apr,
  aprChange,
  ilRisk,
  recommendation
}: LiquidityPoolCardProps) => {
  return (
    <div className="glassmorphism rounded-xl p-3 sm:p-4 card-shine">
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div>
          <h3 className="text-sm sm:text-base font-medium font-mono">{poolName}</h3>
          <div className="flex items-center mt-1">
            <div className="bg-white/10 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center mr-1 sm:mr-2">
              {token1}
            </div>
            <div className="bg-white/10 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center">
              {token2}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base sm:text-lg font-bold font-mono">{balance}</div>
          <div className="flex items-center justify-end mt-0.5 sm:mt-1">
            <span className="text-xs sm:text-sm mr-1">{apr} APR</span>
            {aprChange > 0 ? (
              <div className="flex items-center text-green-400 text-[10px] sm:text-xs">
                <ArrowUp size={10} className="sm:w-3 sm:h-3" />
                {aprChange}%
              </div>
            ) : (
              <div className="flex items-center text-red-400 text-[10px] sm:text-xs">
                <ArrowDown size={10} className="sm:w-3 sm:h-3" />
                {Math.abs(aprChange)}%
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2 sm:mt-3 text-xs sm:text-sm">
        <div className="flex items-center">
          <div className="mr-1 sm:mr-2">IL Risk:</div>
          <div className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs ${
            ilRisk === 'Low' ? 'bg-green-500/20 text-green-400' :
            ilRisk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {ilRisk}
          </div>
        </div>
      </div>
      
      {recommendation && (
        <div className="mt-2 sm:mt-3 p-1.5 sm:p-2 border border-flow-purple/30 bg-flow-indigo/20 rounded-lg text-[10px] sm:text-xs">
          <div className="font-medium text-flow-teal mb-0.5 sm:mb-1">AI Recommendation:</div>
          <p className="text-white/80">{recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default LiquidityPoolCard;

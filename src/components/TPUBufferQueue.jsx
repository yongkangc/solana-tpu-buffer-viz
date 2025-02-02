import { useState, useEffect, useCallback } from "react";
import {
  X,
  Plus,
  Activity,
  Clock,
  Database,
  Zap,
  Moon,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TPUBufferQueue = () => {
  const [queue, setQueue] = useState([]);
  const [dropped, setDropped] = useState([]);
  const [stats, setStats] = useState({
    processed: 0,
    dropped: 0,
    avgFee: 0,
  });
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const MAX_QUEUE_SIZE = 4;

  // Transaction generation
  const generateTransaction = useCallback(() => {
    const fees = [100, 300, 500, 800, 1000, 1200];
    const fee = fees[Math.floor(Math.random() * fees.length)];
    const sizes = ["Small", "Medium", "Large"];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const computeUnits = Math.floor(Math.random() * 100000) + 50000;

    return {
      id: Math.random().toString(36).substr(2, 9),
      fee,
      size,
      computeUnits,
      timestamp: Date.now(),
      signature: `${Math.random().toString(36).substr(2, 9)}...`,
    };
  }, []);

  // Add transaction
  const addTransaction = useCallback(() => {
    const newTx = generateTransaction();

    setQueue((prevQueue) => {
      const newQueue = [...prevQueue, newTx]
        .sort((a, b) => b.fee - a.fee)
        .slice(0, MAX_QUEUE_SIZE);

      if (prevQueue.length >= MAX_QUEUE_SIZE) {
        const dropped = prevQueue[prevQueue.length - 1];
        setDropped((prev) => [...prev.slice(-3), dropped]);
        setStats((prev) => ({
          ...prev,
          dropped: prev.dropped + 1,
          avgFee:
            (prev.avgFee * prev.dropped + dropped.fee) / (prev.dropped + 1),
        }));
      }

      return newQueue;
    });
  }, [generateTransaction]);

  // Process transaction
  const processTransaction = useCallback((txId) => {
    setQueue((prevQueue) => {
      const tx = prevQueue.find((t) => t.id === txId);
      if (tx) {
        setStats((prev) => ({
          ...prev,
          processed: prev.processed + 1,
        }));
      }
      return prevQueue.filter((t) => t.id !== txId);
    });
  }, []);

  // Auto mode effect
  useEffect(() => {
    let interval;
    if (isAutoMode) {
      interval = setInterval(() => {
        if (Math.random() > 0.5) {
          addTransaction();
        }
        if (queue.length > 0 && Math.random() > 0.7) {
          processTransaction(queue[0].id);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAutoMode, queue, addTransaction, processTransaction]);

  // UI Components
  const Card = ({ children, className = "" }) => (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );

  const Button = ({
    onClick,
    variant = "primary",
    children,
    className = "",
  }) => {
    const baseStyles =
      "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
    const variants = {
      primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
      secondary:
        "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:ring-gray-500",
      success:
        "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
      danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
    };

    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  const Badge = ({ children, variant }) => {
    const variants = {
      high: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}
      >
        {children}
      </span>
    );
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-200 ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="w-full px-6 py-6">
        {/* Header */}
        <header className="mb-8 max-w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Solana TPU Buffer Simulator
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Interactive visualization of transaction prioritization
              </p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              <Button
                variant="secondary"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              <Button
                variant={isAutoMode ? "success" : "secondary"}
                onClick={() => setIsAutoMode(!isAutoMode)}
              >
                {isAutoMode ? "Stop Auto" : "Start Auto"}
              </Button>
              <Button
                variant="primary"
                onClick={addTransaction}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Transaction
              </Button>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full">
          {[
            {
              icon: Database,
              label: "Buffer Usage",
              value: `${queue.length}/${MAX_QUEUE_SIZE}`,
            },
            { icon: Activity, label: "Processed", value: stats.processed },
            { icon: X, label: "Dropped", value: stats.dropped },
            {
              icon: Zap,
              label: "Avg Drop Fee",
              value: `${stats.avgFee.toFixed(0)} µℏ`,
            },
          ].map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                <stat.icon size={16} />
                {stat.label}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </Card>
          ))}
        </div>

        {/* TPU Buffer */}
        <Card className="p-6 mb-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
              <Database size={16} />
              TPU Buffer Queue
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {queue.length} of {MAX_QUEUE_SIZE} slots used
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {queue.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {tx.signature}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {tx.computeUnits.toLocaleString()} CU | {tx.size} Size
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        tx.fee >= 800
                          ? "high"
                          : tx.fee >= 500
                          ? "medium"
                          : "low"
                      }
                    >
                      {tx.fee} µℏ/CU
                    </Badge>
                    <Button
                      variant="secondary"
                      onClick={() => processTransaction(tx.id)}
                      className="text-sm"
                    >
                      Process
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {queue.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Database size={24} className="mx-auto mb-2 opacity-50" />
                Buffer is empty. Add some transactions!
              </div>
            )}
          </div>
        </Card>

        {/* Dropped Transactions */}
        <Card className="p-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
              <Clock size={16} />
              Recently Dropped Transactions
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last {dropped.length} dropped
            </div>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {dropped.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400"
                >
                  <div className="flex items-center gap-2">
                    <X size={16} className="text-red-500" />
                    <span>{tx.signature}</span>
                  </div>
                  <Badge variant="low">{tx.fee} µℏ/CU</Badge>
                </motion.div>
              ))}
            </AnimatePresence>

            {dropped.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock size={24} className="mx-auto mb-2 opacity-50" />
                No dropped transactions yet
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TPUBufferQueue;

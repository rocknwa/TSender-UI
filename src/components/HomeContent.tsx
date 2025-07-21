"use client"

import { useState, useEffect } from "react"
import AirdropForm from "@/components/AirdropForm"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { motion, AnimatePresence } from "framer-motion"

// Mock stats for demonstration
const MOCK_STATS = {
    totalAirdrops: "12,847",
    tokensDistributed: "45.2M",
    gasSaved: "89%",
    activeUsers: "3,234"
}

// Feature highlights
const FEATURES = [
    {
        icon: "⚡",
        title: "Ultra Gas Efficient",
        description: "Save up to 89% on gas costs with our optimized batch transfer technology",
        metric: "89% Gas Saved"
    },
    {
        icon: "🚀",
        title: "Lightning Fast",
        description: "Distribute tokens to thousands of addresses in a single transaction",
        metric: "1000+ Recipients"
    },
    {
        icon: "🔒",
        title: "Battle Tested",
        description: "Audited smart contracts trusted by leading DeFi protocols",
        metric: "100% Secure"
    },
    {
        icon: "💎",
        title: "Multi-Chain",
        description: "Support for Ethereum, Base, Zksync, Arbitrum, and more",
        metric: "8+ Networks"
    }
]

export default function HomeContent() {
    const [isUnsafeMode, setIsUnsafeMode] = useState(false)
    const [animatedStats, setAnimatedStats] = useState({
        totalAirdrops: 0,
        tokensDistributed: 0,
        gasSaved: 0,
        activeUsers: 0
    })
    const { isConnected } = useAccount()

    // Animate numbers on mount
    useEffect(() => {
        const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
            const startTime = Date.now()
            const animate = () => {
                const now = Date.now()
                const progress = Math.min((now - startTime) / duration, 1)
                const value = Math.floor(progress * (end - start) + start)
                callback(value)
                if (progress < 1) {
                    requestAnimationFrame(animate)
                }
            }
            animate()
        }

        animateValue(0, 12847, 2000, (value) => 
            setAnimatedStats(prev => ({ ...prev, totalAirdrops: value }))
        )
        animateValue(0, 45200000, 2500, (value) => 
            setAnimatedStats(prev => ({ ...prev, tokensDistributed: value }))
        )
        animateValue(0, 89, 1800, (value) => 
            setAnimatedStats(prev => ({ ...prev, gasSaved: value }))
        )
        animateValue(0, 3234, 2200, (value) => 
            setAnimatedStats(prev => ({ ...prev, activeUsers: value }))
        )
    }, [])

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }
        return num.toLocaleString()
    }

    return (
        <main>
            <AnimatePresence mode="wait">
                {!isConnected ? (
                    <motion.div
                        key="landing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
                    >
                        {/* Hero Section */}
                        <div className="relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-center"
                                >
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                                        The Most{" "}
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            Gas Efficient
                                        </span>
                                        <br />
                                        Airdrop Platform
                                    </h1>
                                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                        Distribute tokens to thousands of addresses in a single transaction. 
                                        Save up to 89% on gas costs with our advanced batch transfer technology.
                                    </p>
                                    
                                    <ConnectButton.Custom>
                                        {({ openConnectModal }) => (
                                            <motion.button
                                                onClick={openConnectModal}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                                            >
                                                Connect Wallet to Get Started 🚀
                                            </motion.button>
                                        )}
                                    </ConnectButton.Custom>
                                </motion.div>
                            </div>
                        </div>

                        {/* Live Stats */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
                        >
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                                <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
                                    📊 Live Platform Statistics
                                </h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {formatNumber(animatedStats.totalAirdrops)}
                                        </div>
                                        <div className="text-gray-600 mt-1">Total Airdrops</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600">
                                            {formatNumber(animatedStats.tokensDistributed)}
                                        </div>
                                        <div className="text-gray-600 mt-1">Tokens Distributed</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">
                                            {animatedStats.gasSaved}%
                                        </div>
                                        <div className="text-gray-600 mt-1">Gas Saved</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-600">
                                            {formatNumber(animatedStats.activeUsers)}
                                        </div>
                                        <div className="text-gray-600 mt-1">Active Users</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Features Grid */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="text-center mb-12"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    Why Choose Our Platform?
                                </h2>
                                <p className="text-lg text-gray-600">
                                    Built for scale, optimized for efficiency, trusted by thousands
                                </p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {FEATURES.map((feature, index) => (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="text-4xl mb-4">{feature.icon}</div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            {feature.description}
                                        </p>
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full inline-block font-medium">
                                            {feature.metric}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* How it Works */}
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 1.0 }}
                                    className="text-center mb-12"
                                >
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        How It Works
                                    </h2>
                                    <p className="text-lg text-gray-600">
                                        Three simple steps to distribute your tokens efficiently
                                    </p>
                                </motion.div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {[
                                        { step: "1", title: "Connect Wallet", desc: "Connect your Web3 wallet securely", icon: "🔗" },
                                        { step: "2", title: "Upload Recipients", desc: "Add addresses", icon: "📝" },
                                        { step: "3", title: "Batch Transfer", desc: "Execute gas-optimized batch transaction", icon: "🚀" }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item.step}
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 1.2 + index * 0.2 }}
                                            className="text-center"
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                                                {item.step}
                                            </div>
                                            <div className="text-4xl mb-3">{item.icon}</div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600">{item.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.6 }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 py-16"
                        >
                            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                                <h2 className="text-3xl font-bold text-white mb-4">
                                    Ready to Start Your Airdrop?
                                </h2>
                                <p className="text-xl text-blue-100 mb-8">
                                    Join thousands of projects using our platform to distribute tokens efficiently
                                </p>
                                <ConnectButton.Custom>
                                    {({ openConnectModal }) => (
                                        <motion.button
                                            onClick={openConnectModal}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                                        >
                                            Connect Your Wallet Now 💎
                                        </motion.button>
                                    )}
                                </ConnectButton.Custom>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="app"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center p-4 md:p-6 xl:p-8"
                    >
                        <AirdropForm isUnsafeMode={isUnsafeMode} onModeChange={setIsUnsafeMode} />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
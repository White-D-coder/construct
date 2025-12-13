import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import StoreItemCard from '../components/StoreItemCard';
import { ShoppingBag, Star, Package } from 'lucide-react';

const Store = () => {
    const [items, setItems] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStoreData();
    }, []);

    const fetchStoreData = async () => {
        try {
            const [itemsRes, invRes, balanceRes] = await Promise.all([
                api.get('/store/items'),
                api.get('/store/inventory'),
                api.get('/store/balance')
            ]);

            setItems(itemsRes.data);
            setInventory(invRes.data);
            setBalance(balanceRes.data.balance);
        } catch (err) {
            console.error('Error fetching store data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async (item) => {
        if (!confirm(`Are you sure you want to redeem "${item.name}" for ${item.cost} tokens?`)) return;

        try {
            const res = await api.post('/store/redeem', { itemId: item.id });
            setBalance(res.data.newBalance);
            // Refresh inventory
            const invRes = await api.get('/store/inventory');
            setInventory(invRes.data);
            alert('Item redeemed successfully!');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || 'Failed to redeem item');
        }
    };

    const isOwned = (itemId) => {
        return inventory.some(inv => inv.item.id === itemId || inv.item_id === itemId);
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full text-white">Loading Store...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Token Store</h1>
                        <p className="text-gray-400">Redeem your hard-earned tokens for exclusive rewards.</p>
                    </div>

                    <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-6 py-3 rounded-xl">
                        <Star className="text-yellow-500" fill="currentColor" size={24} />
                        <div className="flex flex-col">
                            <span className="text-xs text-yellow-500/80 font-bold uppercase tracking-wider">Balance</span>
                            <span className="text-2xl font-bold text-yellow-400">{balance} Tokens</span>
                        </div>
                    </div>
                </div>

                {/* Available Items */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <ShoppingBag size={20} className="text-blue-400" />
                        Available Rewards
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.length > 0 ? (
                            items.map(item => (
                                <StoreItemCard
                                    key={item.id}
                                    item={item}
                                    onRedeem={handleRedeem}
                                    userBalance={balance}
                                    isOwned={isOwned(item.id)}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full">No items available in the store.</p>
                        )}
                    </div>
                </div>

                {/* My Inventory (Optional view) */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Package size={20} className="text-green-400" />
                        My Inventory
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {inventory.length > 0 ? (
                            inventory.map(inv => (
                                <div key={inv.id || inv.item_id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
                                    <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
                                        <Star size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-200">{inv.item ? inv.item.name : 'Unknown Item'}</h4>
                                        <p className="text-xs text-gray-500">Purchased: {new Date(inv.purchased_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full">You haven't purchased any items yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Store;

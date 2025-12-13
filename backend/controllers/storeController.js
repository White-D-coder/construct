const supabase = require('../config/supabase');

exports.getStoreItems = async (req, res) => {
    try {
        const { data: items, error } = await supabase
            .from('store_items')
            .select('*')
            .order('cost', { ascending: true });

        if (error) throw error;

        // Also fetch user's balance and inventory to show what they own?
        // Let's do that in a separate call or return here if needed.
        // For now, just items.

        res.json(items);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getUserInventory = async (req, res) => {
    try {
        const { data: inventory, error } = await supabase
            .from('user_inventory')
            .select(`
                purchased_at,
                item:store_items(*)
            `)
            .eq('user_id', req.user.id);

        if (error) throw error;

        res.json(inventory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getUserBalance = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('virtual_tokens')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;

        res.json({ balance: user.virtual_tokens || 0 });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.redeemItem = async (req, res) => {
    const { itemId } = req.body;

    try {
        // 1. Get Item Cost
        const { data: item, error: itemError } = await supabase
            .from('store_items')
            .select('*')
            .eq('id', itemId)
            .single();

        if (itemError || !item) return res.status(404).json({ msg: 'Item not found' });

        // 2. Get User Balance
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('virtual_tokens')
            .eq('id', req.user.id)
            .single();

        if (userError) throw userError;

        const balance = user.virtual_tokens || 0;

        if (balance < item.cost) {
            return res.status(400).json({ msg: 'Insufficient tokens' });
        }

        // 3. Check if already owned (optional, for unique items like themes)
        // Let's assume themes are unique, consumables (XP tokens) might not be.
        // For simplicity, allow multiple for now unless it's a theme.

        // 4. Deduct Tokens & Add to Inventory
        const newBalance = balance - item.cost;

        // Update Balance
        const { error: updateError } = await supabase
            .from('users')
            .update({ virtual_tokens: newBalance })
            .eq('id', req.user.id);

        if (updateError) throw updateError;

        // Add to Inventory
        const { error: invError } = await supabase
            .from('user_inventory')
            .insert([{ user_id: req.user.id, item_id: itemId }]);

        if (invError) throw invError;

        res.json({ msg: 'Item redeemed successfully', newBalance });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

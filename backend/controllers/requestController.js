const supabase = require('../config/supabase');

exports.sendRequest = async (req, res) => {
    const { receiverId } = req.body;

    try {
        // Check if request already exists
        const { data: existing, error: checkError } = await supabase
            .from('partner_requests')
            .select('*')
            .or(`and(sender_id.eq.${req.user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${req.user.id})`);

        if (existing && existing.length > 0) {
            return res.status(400).json({ msg: 'Request already exists or you are already partners' });
        }

        const { data, error } = await supabase
            .from('partner_requests')
            .insert([
                { sender_id: req.user.id, receiver_id: receiverId }
            ])
            .select()
            .single();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getRequests = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('partner_requests')
            .select(`
        id,
        status,
        created_at,
        sender:users!sender_id(username)
      `)
            .eq('receiver_id', req.user.id)
            .eq('status', 'pending');

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.respondToRequest = async (req, res) => {
    const { requestId, status } = req.body; // status: 'accepted' or 'rejected'

    try {
        const { data: request, error: fetchError } = await supabase
            .from('partner_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (fetchError || !request) return res.status(404).json({ msg: 'Request not found' });
        if (request.receiver_id !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        // Update request status
        const { error: updateError } = await supabase
            .from('partner_requests')
            .update({ status })
            .eq('id', requestId);

        if (updateError) throw updateError;

        // If accepted, create partnership
        if (status === 'accepted') {
            const { error: partnerError } = await supabase
                .from('partnerships')
                .insert([
                    { user1_id: request.sender_id, user2_id: request.receiver_id }
                ]);

            if (partnerError) throw partnerError;
        }

        res.json({ msg: `Request ${status}` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

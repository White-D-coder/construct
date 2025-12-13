const supabase = require('./config/supabase');

async function checkTables() {
    console.log("Checking database tables...");

    const tablesToCheck = ['users', 'store_items', 'user_inventory', 'goal_invitations'];

    for (const table of tablesToCheck) {
        const { data, error } = await supabase.from(table).select('id').limit(1);
        if (error) {
            console.error(`❌ Table '${table}' check failed:`, error.message);
        } else {
            console.log(`✅ Table '${table}' exists.`);
        }
    }

    // Check column
    const { data: user, error: userError } = await supabase.from('users').select('virtual_tokens').limit(1);
    if (userError) {
        console.error(`❌ Column 'virtual_tokens' in 'users' check failed:`, userError.message);
    } else {
        console.log(`✅ Column 'virtual_tokens' in 'users' exists.`);
    }
}

checkTables();

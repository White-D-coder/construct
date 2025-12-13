require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('Checking credentials...');
if (!supabaseUrl) console.error('Missing SUPABASE_URL');
if (!supabaseKey) console.error('Missing SUPABASE_KEY');

if (!supabaseUrl || !supabaseKey) {
    console.error('Please add SUPABASE_URL and SUPABASE_KEY to backend/.env');
    process.exit(1);
}

console.log('Initializing Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to Supabase...');
    try {
        // Try to fetch 1 user to check connection and table existence
        const { data, error } = await supabase.from('users').select('id').limit(1);

        if (error) {
            console.error('Supabase Error:', error.message);
            if (error.code === '42P01') {
                console.log('HINT: The "users" table does not exist. You need to run the schema.sql script in your Supabase SQL Editor.');
            }
        } else {
            console.log('Connection SUCCESSFUL!');
            console.log('Users table exists and is accessible.');
        }
    } catch (err) {
        console.error('Unexpected Error:', err.message);
    }
}

testConnection();

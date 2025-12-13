const supabase = require('./config/supabase');

async function checkGoals() {
    console.log("Checking goals table...");
    const { data, error } = await supabase.from('goals').select('id').limit(1);
    if (error) {
        console.error("❌ Stats:", error.message);
    } else {
        console.log("✅ Goals table exists.");
    }
}

checkGoals();

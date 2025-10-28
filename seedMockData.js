import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase credentials
const supabaseUrl = 'https://zxqlvusgbqodolzyaqnz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cWx2dXNnYnFvZG9senlhcW56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA0NzQyMywiZXhwIjoyMDc2NjIzNDIzfQ.0lPd1zdDNeLuzX6Jj33Mpsz_S5JPrDz0OCXfusbBST8'; // NOT the anon key!

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedMockData() {
  console.log('Starting to seed mock data...');

  const challenges = ['anxiety', 'depression', 'loneliness', 'stress'];
  const locations = ['Queens', 'Brooklyn', 'Manhattan', 'Bronx'];
  
  // Create 50 mock mood check-ins
  const mockMoods = [];
  
  for (let i = 0; i < 50; i++) {
    const today = new Date();
    
    // Random time today (spread throughout the day)
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    today.setHours(randomHour, randomMinute, 0, 0);
    
    mockMoods.push({
      user_id: null, // Mock data doesn't need real user_id
      mood: Math.floor(Math.random() * 5) + 1, // 1-5
      location: locations[Math.floor(Math.random() * locations.length)],
      challenge: challenges[Math.floor(Math.random() * challenges.length)],
      timestamp: today.toISOString(),
      is_mock_data: true
    });
  }

  // Insert into database
  const { data, error } = await supabase
    .from('moods')
    .insert(mockMoods);

  if (error) {
    console.error('Error seeding data:', error);
  } else {
    console.log('✅ Successfully seeded 50 mock mood check-ins!');
    console.log('Check your Supabase dashboard to verify.');
  }
}

seedMockData();
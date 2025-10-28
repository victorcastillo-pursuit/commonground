import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxqlvusgbqodolzyaqnz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cWx2dXNnYnFvZG9senlhcW56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA0NzQyMywiZXhwIjoyMDc2NjIzNDIzfQ.0lPd1zdDNeLuzX6Jj33Mpsz_S5JPrDz0OCXfusbBST8'; // NOT the anon key!

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const challenges = ['Anxiety', 'Depression', 'Loneliness', 'Stress'];
const groupPreferences = ['Small groups (3-5)', 'Medium groups (6-10)', 'Large groups (10+)'];

const mockUsers = [
  { 
    name: 'Sarah Johnson', 
    location: 'Queens, NY',
    challenges: ['Anxiety', 'Stress'],
    group_preference: 'Small groups (3-5)'
  },
  { 
    name: 'Michael Chen', 
    location: 'Brooklyn, NY',
    challenges: ['Loneliness'],
    group_preference: 'Medium groups (6-10)'
  },
  { 
    name: 'Emily Rodriguez', 
    location: 'Manhattan, NY',
    challenges: ['Depression', 'Anxiety'],
    group_preference: 'Small groups (3-5)'
  },
  { 
    name: 'David Kim', 
    location: 'Bronx, NY',
    challenges: ['Stress'],
    group_preference: 'Large groups (10+)'
  },
  { 
    name: 'Jessica Martinez', 
    location: 'Queens, NY',
    challenges: ['Anxiety', 'Loneliness'],
    group_preference: 'Medium groups (6-10)'
  },
  { 
    name: 'Alex Thompson', 
    location: 'Brooklyn, NY',
    challenges: ['Depression'],
    group_preference: 'Small groups (3-5)'
  },
  { 
    name: 'Maria Garcia', 
    location: 'Manhattan, NY',
    challenges: ['Stress', 'Anxiety'],
    group_preference: 'Medium groups (6-10)'
  },
  { 
    name: 'James Wilson', 
    location: 'Staten Island, NY',
    challenges: ['Loneliness'],
    group_preference: 'Small groups (3-5)'
  }
];

async function seedUsers() {
  console.log('Creating mock users...');

  for (const user of mockUsers) {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select();

    if (error) {
      console.error(`Error creating ${user.name}:`, error);
    } else {
      console.log(`Created user: ${user.name}`);
    }
  }

  console.log('Done seeding users!');
}

seedUsers();
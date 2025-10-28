import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxqlvusgbqodolzyaqnz.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cWx2dXNnYnFvZG9senlhcW56Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTA0NzQyMywiZXhwIjoyMDc2NjIzNDIzfQ.0lPd1zdDNeLuzX6Jj33Mpsz_S5JPrDz0OCXfusbBST8'; // NOT the anon key!

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const activityTypes = [
  'Coffee Meetup',
  'Walking Group',
  'Book Club',
  'Art Session',
  'Game Night',
  'Movie Night',
  'Yoga Class',
  'Cooking Together',
  'Park Hangout',
  'Volunteer Work'
];

const locations = [
  'Central Park',
  'Local Coffee Shop',
  'Community Center',
  'Public Library',
  'Riverside Park',
  'Art Studio',
  'Yoga Studio',
  'Community Garden',
  'Recreation Center',
  'Downtown Cafe'
];

const descriptions = [
  'A casual gathering for people who want to connect over shared experiences.',
  'Come join us for a relaxed time together. All are welcome.',
  'A safe space to meet others and build meaningful connections.',
  'No pressure, just good company and conversation.',
  'Perfect for anyone looking to expand their social circle.',
  'Meet new people in a comfortable, supportive environment.',
  'A welcoming group for those seeking connection and community.',
  'Join us for a positive and uplifting experience.',
  'Great opportunity to meet like-minded people.',
  'Open to everyone who wants to connect and share.'
];

async function seedActivities() {
  console.log('Starting to seed activities...');

  // Get all users to use as creators
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id');

  if (usersError || !users || users.length === 0) {
    console.error('Error fetching users or no users found:', usersError);
    return;
  }

  const activities = [];
  const today = new Date();

  // Create 20 mock activities
  for (let i = 0; i < 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const daysToAdd = Math.floor(Math.random() * 14); // Activities within next 2 weeks
    const activityDate = new Date(today);
    activityDate.setDate(today.getDate() + daysToAdd);

    const hour = Math.floor(Math.random() * 12) + 10; // Between 10 AM and 10 PM
    const minute = Math.random() > 0.5 ? '00' : '30';

    activities.push({
      title: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      activity_type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      date: activityDate.toISOString().split('T')[0],
      time: `${hour.toString().padStart(2, '0')}:${minute}:00`,
      location: locations[Math.floor(Math.random() * locations.length)],
      max_participants: Math.floor(Math.random() * 6) + 5, // 5-10 people
      creator_id: randomUser.id
    });
  }

  const { data, error } = await supabase
    .from('activities')
    .insert(activities)
    .select();

  if (error) {
    console.error('Error seeding activities:', error);
  } else {
    console.log(`Successfully seeded ${data.length} activities!`);
    
    // Add some random participants to activities
    await seedParticipants(data, users);
  }
}

async function seedParticipants(activities, users) {
  console.log('Adding participants to activities...');
  
  const participants = [];

  // Add 1-4 random participants to each activity
  for (const activity of activities) {
    const numParticipants = Math.floor(Math.random() * 4) + 1;
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numParticipants && i < shuffledUsers.length; i++) {
      // Don't add creator as participant
      if (shuffledUsers[i].id !== activity.creator_id) {
        participants.push({
          activity_id: activity.id,
          user_id: shuffledUsers[i].id
        });
      }
    }
  }

  const { error } = await supabase
    .from('activity_participants')
    .insert(participants);

  if (error) {
    console.error('Error seeding participants:', error);
  } else {
    console.log(`Successfully added ${participants.length} participant records!`);
  }
}

seedActivities();
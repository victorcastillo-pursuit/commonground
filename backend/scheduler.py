import os
from dotenv import load_dotenv  # ADD THIS
from datetime import datetime, timedelta
import time
import schedule
from supabase import create_client
from email_service import EmailService

# Load environment variables from .env file
load_dotenv()  # ADD THIS

class ReminderScheduler:
    def __init__(self):
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_KEY')
        
        # Debug: Check if variables are loaded
        if not supabase_url or not supabase_key:
            print("❌ Error: Environment variables not loaded!")
            print(f"SUPABASE_URL: {'✓' if supabase_url else '✗'}")
            print(f"SUPABASE_SERVICE_KEY: {'✓' if supabase_key else '✗'}")
            raise Exception("Missing environment variables. Check your .env file.")
        
        self.supabase = create_client(supabase_url, supabase_key)
        self.email_service = EmailService()
    
    def check_activity_reminders(self):
        """Check for activities happening in 24 hours and send reminders"""
        
        print(f"🔍 Checking for activity reminders at {datetime.now()}")
        
        # Calculate tomorrow's date
        tomorrow = datetime.now() + timedelta(days=1)
        tomorrow_date = tomorrow.strftime('%Y-%m-%d')
        
        try:
            # Get all activities happening tomorrow
            response = self.supabase.table('activities').select(
                'id, title, date, time, location, creator_id'
            ).eq('date', tomorrow_date).execute()
            
            activities = response.data
            
            if not activities:
                print(f"✓ No activities scheduled for {tomorrow_date}")
                return
            
            print(f"✓ Found {len(activities)} activities for {tomorrow_date}")
            
            # For each activity, get participants and send reminders
            for activity in activities:
                self._send_reminders_for_activity(activity)
                
        except Exception as e:
            print(f"❌ Error checking activity reminders: {str(e)}")
    
    def _send_reminders_for_activity(self, activity):
        """Send reminder emails to all participants of an activity"""
        
        try:
            # Get all participants for this activity
            response = self.supabase.table('activity_participants').select(
                'user_id'
            ).eq('activity_id', activity['id']).execute()
            
            participant_ids = [p['user_id'] for p in response.data]
            
            # Also include the creator
            if activity['creator_id'] not in participant_ids:
                participant_ids.append(activity['creator_id'])
            
            if not participant_ids:
                print(f"⚠️  No participants for activity: {activity['title']}")
                return
            
            # Get user details for all participants
            users_response = self.supabase.table('users').select(
                'id, name, email'
            ).in_('id', participant_ids).execute()
            
            users = users_response.data
            
            print(f"   Activity: {activity['title']}")
            print(f"   Sending to {len(users)} participants...")
            
            # Send email to each user
            for user in users:
                if not user.get('email'):
                    print(f"   ⚠️  {user['name']} has no email address")
                    continue
                
                result = self.email_service.send_activity_reminder(
                    to_email=user['email'],
                    user_name=user['name'],
                    activity_title=activity['title'],
                    activity_date=activity['date'],
                    activity_time=activity['time'],
                    activity_location=activity['location']
                )
                
                print(f"   ✓ Sent to {user['name']} ({user['email']}): {result['status']}")
                
        except Exception as e:
            print(f"❌ Error sending reminders for activity {activity['id']}: {str(e)}")
    
    def send_daily_checkin_reminders(self):
        """Send daily check-in reminders to all active users"""
        
        print(f"🔍 Sending daily check-in reminders at {datetime.now()}")
        
        try:
            # Get all users who haven't checked in today
            today = datetime.now().strftime('%Y-%m-%d')
            
            # Get users who already checked in today
            checked_in_response = self.supabase.table('moods').select(
                'user_id'
            ).gte('timestamp', f'{today}T00:00:00').execute()
            
            checked_in_ids = [m['user_id'] for m in checked_in_response.data if m['user_id']]
            
            # Get all users
            all_users_response = self.supabase.table('users').select(
                'id, name, email'
            ).execute()
            
            # Filter out users who already checked in
            users_to_remind = [
                user for user in all_users_response.data 
                if user['id'] not in checked_in_ids and user.get('email')
            ]
            
            print(f"✓ Sending reminders to {len(users_to_remind)} users")
            
            for user in users_to_remind:
                result = self.email_service.send_daily_checkin_reminder(
                    to_email=user['email'],
                    user_name=user['name']
                )
                
                print(f"✓ Check-in reminder sent to {user['name']}: {result['status']}")
                
        except Exception as e:
            print(f"❌ Error sending daily check-in reminders: {str(e)}")


# Main execution
if __name__ == "__main__":
    print("=" * 50)
    print("🚀 CommonGround Reminder Scheduler Started")
    print("=" * 50)
    
    try:
        scheduler = ReminderScheduler()
        
        # Schedule activity reminders to run every hour
        schedule.every().hour.do(scheduler.check_activity_reminders)
        
        # Schedule daily check-in reminders at 9 AM
        schedule.every().day.at("09:00").do(scheduler.send_daily_checkin_reminders)
        
        # Run immediately on startup
        print("\n🔄 Running initial check...")
        scheduler.check_activity_reminders()
        
        print("\n⏰ Scheduler is running. Press Ctrl+C to stop.")
        print("   - Activity reminders: Every hour")
        print("   - Daily check-ins: Every day at 9 AM")
        print("-" * 50)
        
        # Keep the scheduler running
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
            
    except KeyboardInterrupt:
        print("\n\n👋 Scheduler stopped by user")
    except Exception as e:
        print(f"\n❌ Fatal error: {str(e)}")
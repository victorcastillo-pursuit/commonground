import os
import schedule
import time
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client
from email_service import EmailService
from scheduler import ReminderScheduler

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Initialize services
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_KEY')
supabase = create_client(supabase_url, supabase_key)

email_service = EmailService()
reminder_scheduler = ReminderScheduler()

# ============================================
# API ENDPOINTS
# ============================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "CommonGround backend is running!"
    }), 200

@app.route('/api/send-test-email', methods=['POST'])
def send_test_email():
    """Test endpoint to send a sample email"""
    data = request.json
    
    to_email = data.get('email')
    if not to_email:
        return jsonify({"error": "Email address required"}), 400
    
    result = email_service.send_daily_checkin_reminder(
        to_email=to_email,
        user_name="Test User"
    )
    
    return jsonify(result), 200

@app.route('/api/send-activity-reminder', methods=['POST'])
def send_activity_reminder_manual():
    """Manually trigger activity reminder for testing"""
    data = request.json
    
    required_fields = ['email', 'user_name', 'activity_title', 'activity_date', 'activity_time', 'activity_location']
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    result = email_service.send_activity_reminder(
        to_email=data['email'],
        user_name=data['user_name'],
        activity_title=data['activity_title'],
        activity_date=data['activity_date'],
        activity_time=data['activity_time'],
        activity_location=data['activity_location']
    )
    
    return jsonify(result), 200

@app.route('/api/trigger-activity-reminders', methods=['POST'])
def trigger_activity_reminders():
    """Manually trigger the activity reminder check"""
    try:
        reminder_scheduler.check_activity_reminders()
        return jsonify({
            "status": "success",
            "message": "Activity reminders checked and sent"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/trigger-checkin-reminders', methods=['POST'])
def trigger_checkin_reminders():
    """Manually trigger daily check-in reminders"""
    try:
        reminder_scheduler.send_daily_checkin_reminders()
        return jsonify({
            "status": "success",
            "message": "Check-in reminders sent"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/user-email', methods=['POST'])
def save_user_email():
    """Endpoint to save/update user email address"""
    data = request.json
    
    user_id = data.get('user_id')
    email = data.get('email')
    
    if not user_id or not email:
        return jsonify({"error": "user_id and email required"}), 400
    
    try:
        response = supabase.table('users').update({
            'email': email
        }).eq('id', user_id).execute()
        
        return jsonify({
            "status": "success",
            "message": "Email saved successfully"
        }), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# ============================================
# SCHEDULED TASKS
# ============================================

def run_scheduler():
    """Run scheduled tasks in a separate thread"""
    
    # Check for activity reminders every hour
    schedule.every().hour.do(reminder_scheduler.check_activity_reminders)
    
    # Send daily check-in reminders at 9 AM every day
    schedule.every().day.at("09:00").do(reminder_scheduler.send_daily_checkin_reminders)
    
    print("📅 Scheduler started!")
    print("- Activity reminders: Every hour")
    print("- Daily check-in reminders: 9:00 AM daily")
    
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute

# Start scheduler in background thread
scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
scheduler_thread.start()

# ============================================
# RUN SERVER
# ============================================

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    print(f"\n🚀 CommonGround Backend Starting...")
    print(f"📡 Server running on http://localhost:{port}")
    print(f"💚 Ready to send email reminders!\n")
    
    app.run(
        debug=True,
        port=port,
        host='0.0.0.0'
    )

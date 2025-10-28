import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from datetime import datetime

class EmailService:
    def __init__(self):
        self.api_key = os.getenv('SENDGRID_API_KEY')
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@commonground.app')
        self.sg = SendGridAPIClient(self.api_key) if self.api_key else None
    
    def send_activity_reminder(self, to_email, user_name, activity_title, activity_date, activity_time, activity_location):
        """Send reminder email for upcoming activity"""
        
        subject = f"Reminder: {activity_title} is coming up!"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #C85C4C; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">CommonGround</h1>
                </div>
                
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #333;">Hi {user_name}! 👋</h2>
                    
                    <p style="font-size: 16px; color: #555;">
                        This is a friendly reminder about your upcoming activity:
                    </p>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #C85C4C; margin-top: 0;">{activity_title}</h3>
                        <p style="margin: 10px 0;"><strong>📅 Date:</strong> {activity_date}</p>
                        <p style="margin: 10px 0;"><strong>🕐 Time:</strong> {activity_time}</p>
                        <p style="margin: 10px 0;"><strong>📍 Location:</strong> {activity_location}</p>
                    </div>
                    
                    <p style="font-size: 16px; color: #555;">
                        We're looking forward to seeing you there! Remember, you're not alone. 💚
                    </p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="http://localhost:5173/activities" 
                           style="background-color: #C85C4C; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            View Activity Details
                        </a>
                    </div>
                </div>
                
                <div style="background-color: #E8DCC4; padding: 20px; text-align: center;">
                    <p style="color: #666; font-size: 12px; margin: 0;">
                        You're receiving this because you RSVP'd to this activity on CommonGround.
                    </p>
                </div>
            </body>
        </html>
        """
        
        return self._send_email(to_email, subject, html_content)
    
    def send_daily_checkin_reminder(self, to_email, user_name):
        """Send daily reminder to check in"""
        
        subject = "How are you feeling today? 💭"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #8BA888; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">CommonGround</h1>
                </div>
                
                <div style="padding: 30px; background-color: #f9f9f9;">
                    <h2 style="color: #333;">Hi {user_name}! 🌤️</h2>
                    
                    <p style="font-size: 16px; color: #555;">
                        Taking a moment to check in with yourself is an act of self-care.
                    </p>
                    
                    <p style="font-size: 16px; color: #555;">
                        How are you feeling today? Your community is here to support you.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:5173/check-in" 
                           style="background-color: #8BA888; color: white; padding: 15px 40px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block; 
                                  font-size: 18px;">
                            Check In Now
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #777; text-align: center;">
                        It only takes 30 seconds ⏱️
                    </p>
                </div>
                
                <div style="background-color: #E8DCC4; padding: 20px; text-align: center;">
                    <p style="color: #666; font-size: 12px; margin: 0;">
                        You're receiving daily check-in reminders from CommonGround.
                    </p>
                </div>
            </body>
        </html>
        """
        
        return self._send_email(to_email, subject, html_content)
    
    def _send_email(self, to_email, subject, html_content):
        """Internal method to send email via SendGrid"""
        
        if not self.sg:
            print("⚠️  SendGrid API key not configured. Email would be sent to:", to_email)
            print("Subject:", subject)
            return {"status": "simulated", "message": "Email logged (no API key)"}
        
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=to_email,
                subject=subject,
                html_content=html_content
            )
            
            response = self.sg.send(message)
            
            return {
                "status": "sent",
                "status_code": response.status_code,
                "message": "Email sent successfully"
            }
            
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }

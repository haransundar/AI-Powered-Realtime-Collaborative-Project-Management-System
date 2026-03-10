import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from app.database import get_db, serialize_doc, deserialize_id
import os

class OTPService:
    collection_name = 'otp_codes'
    OTP_EXPIRY_MINUTES = 10
    
    @staticmethod
    def get_collection():
        return get_db()[OTPService.collection_name]
    
    @staticmethod
    def generate_otp():
        return ''.join(random.choices(string.digits, k=6))
    
    @staticmethod
    def create_otp(email):
        # Delete any existing OTP for this email
        OTPService.get_collection().delete_many({'email': email.lower()})
        
        otp_code = OTPService.generate_otp()
        otp_record = {
            'email': email.lower(),
            'code': otp_code,
            'created_at': datetime.utcnow(),
            'expires_at': datetime.utcnow() + timedelta(minutes=OTPService.OTP_EXPIRY_MINUTES),
            'verified': False
        }
        OTPService.get_collection().insert_one(otp_record)
        return otp_code
    
    @staticmethod
    def verify_otp(email, code):
        otp_record = OTPService.get_collection().find_one({
            'email': email.lower(),
            'code': code,
            'expires_at': {'$gt': datetime.utcnow()},
            'verified': False
        })
        
        if otp_record:
            OTPService.get_collection().update_one(
                {'_id': otp_record['_id']},
                {'$set': {'verified': True}}
            )
            return True
        return False
    
    @staticmethod
    def is_email_verified(email):
        otp_record = OTPService.get_collection().find_one({
            'email': email.lower(),
            'verified': True
        })
        return otp_record is not None
    
    @staticmethod
    def delete_otp(email):
        OTPService.get_collection().delete_many({'email': email.lower()})


class EmailService:
    @staticmethod
    def send_otp_email(to_email, otp_code):
        """Send OTP via email using SMTP"""
        smtp_host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.getenv('SMTP_PORT', '587'))
        smtp_user = os.getenv('SMTP_USER', '')
        smtp_password = os.getenv('SMTP_PASSWORD', '')
        from_email = os.getenv('FROM_EMAIL', smtp_user)
        
        # If SMTP is not configured, just print the OTP (for development)
        if not smtp_user or not smtp_password:
            print(f"\n{'='*50}")
            print(f"EMAIL VERIFICATION OTP for {to_email}")
            print(f"OTP Code: {otp_code}")
            print(f"{'='*50}\n")
            return True
        
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = 'Verify Your Email - AI Project Manager'
            msg['From'] = from_email
            msg['To'] = to_email
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
                    .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }}
                    .otp-box {{ background: white; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }}
                    .otp-code {{ font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; }}
                    .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>AI Project Manager</h1>
                    </div>
                    <div class="content">
                        <h2>Verify Your Email Address</h2>
                        <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
                        <div class="otp-box">
                            <div class="otp-code">{otp_code}</div>
                        </div>
                        <p>This code will expire in <strong>10 minutes</strong>.</p>
                        <p>If you didn't request this verification, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 AI Project Manager. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            text_content = f"""
            AI Project Manager - Email Verification
            
            Your OTP code is: {otp_code}
            
            This code will expire in 10 minutes.
            
            If you didn't request this verification, please ignore this email.
            """
            
            msg.attach(MIMEText(text_content, 'plain'))
            msg.attach(MIMEText(html_content, 'html'))
            
            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(from_email, to_email, msg.as_string())
            
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            # Fall back to printing OTP
            print(f"\n{'='*50}")
            print(f"EMAIL VERIFICATION OTP for {to_email}")
            print(f"OTP Code: {otp_code}")
            print(f"{'='*50}\n")
            return True

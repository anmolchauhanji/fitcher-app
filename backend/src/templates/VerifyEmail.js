export const verifyEmailTemplate = (name,otp) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: bold; }
        .header p { margin: 10px 0 0 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #22c55e; font-size: 24px; margin: 0 0 20px 0; }
        .content p { margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; }
        .button-container { text-align: center; margin: 35px 0; }
        .button { display: inline-block; background-color: #22c55e; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; }
        .button:hover { background-color: #16a34a; }
        .info-box { background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 25px 0; border-radius: 4px; }
        .info-box p { margin: 0; font-size: 14px; color: #166534; }
        .footer { background-color: #1f2937; color: #9ca3af; padding: 30px; text-align: center; font-size: 13px; }
        .footer p { margin: 0 0 8px 0; }
    </style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0; padding: 20px; background: #f8f9fa;">
        <tr>
            <td align="center">
                <div class="container">
                    <div class="header">
                        <h1>🏋️ FITNESS APP</h1>
                        <p>Train Hard • Eat Smart • Stay Consistent</p>
                    </div>
                    
                    <div class="content">
                        <h2>Hi ${name} 👋</h2>
                        
                        <p>Welcome to <strong>Fitness App</strong>!</p>
                        
                        <p>You're just one step away from unlocking your personalized workouts, nutrition tracking, progress analytics, and complete fitness journey.</p>
                        
                        <p>Please verify your email address to activate your account.</p>
                        
                       
                        <div class="button-container">
                            <a  class="button">${otp}</a>
                        </div>
                        
                        <div class="info-box">
                            <p><strong>⏳ Verification Link Expiration:</strong><br>This link will expire in <strong>1 hour</strong>.</p>
                        </div>
                        
                        <p>If you didn't create this account, please ignore this email and take no action.</p>
                    </div>
                    
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} Fitness App. All rights reserved.</p>
                        <p>Build Strength • Stay Healthy • Live Better</p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>`
};
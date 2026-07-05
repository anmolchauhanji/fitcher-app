export const verifyEmailTemplate = (name, otp) => {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{
font-family:Arial,sans-serif;
background:#f4f7fb;
margin:0;
padding:20px;
color:#333;
}

.container{
max-width:600px;
margin:auto;
background:#fff;
border-radius:12px;
overflow:hidden;
box-shadow:0 5px 20px rgba(0,0,0,.08);
}

.header{
background:linear-gradient(135deg,#0f172a,#1e293b);
padding:40px 20px;
text-align:center;
color:#fff;
}

.header h1{
margin:0;
font-size:34px;
letter-spacing:1px;
}

.header p{
margin-top:10px;
font-size:15px;
opacity:.9;
}

.content{
padding:40px 30px;
}

.content h2{
margin-top:0;
color:#0f172a;
}

.content p{
font-size:16px;
line-height:1.7;
}

.otp-box{
margin:35px auto;
text-align:center;
}

.otp{
display:inline-block;
padding:18px 45px;
background:#14b8a6;
color:white;
font-size:34px;
font-weight:bold;
border-radius:10px;
letter-spacing:8px;
}

.info{
margin-top:30px;
background:#ecfeff;
padding:18px;
border-left:5px solid #14b8a6;
border-radius:8px;
}

.footer{
background:#111827;
color:#d1d5db;
padding:30px;
text-align:center;
font-size:14px;
}

.footer a{
color:#14b8a6;
text-decoration:none;
}
</style>
</head>

<body>

<div class="container">

<div class="header">

<h1>VELRION</h1>

<p>India's Smart Construction Marketplace</p>

</div>

<div class="content">

<h2>Hello ${name} 👋</h2>

<p>
Welcome to <strong>Velrion</strong>.
</p>

<p>
You're just one step away from connecting with trusted contractors,
posting construction projects, comparing bids, and managing your work
with confidence.
</p>

<p>
Please verify your email address using the OTP below.
</p>

<div class="otp-box">

<div class="otp">

${otp}

</div>

</div>

<div class="info">

<strong>Security Notice</strong>

<br><br>

• This OTP is valid for <strong>1 hour</strong>.

<br>

• Never share this OTP with anyone.

<br>

• If you didn't create a Velrion account, you can safely ignore this email.

</div>

</div>

<div class="footer">

<p>

© ${new Date().getFullYear()} Velrion.
All Rights Reserved.

</p>

<p>

Building Trust Before Buildings.

</p>

<p>

🌐 velrionmedia.in

</p>

</div>

</div>

</body>
</html>`;
};
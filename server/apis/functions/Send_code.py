# Python code to illustrate Sending mail from 
# your Gmail account 
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def Send_code(email,username,code):   
    subject = "Your Perfectrader Authentication Details are ready!!!"
    body = "Hello from Perfectrader!\n\nYour requested for account was accepted.\n\nYour account Details :- \n \t\tusername :"+ str(username)+"\n\t\tcode:"+str(code) + "\nYou can create account using above credintials."  
 
    msg = MIMEMultipart()
    msg.set_unixfrom('author')
    msg['From'] = 'authorization@mahalaxmitrade.com'
    msg['To'] = f"{email}"
    msg['Subject'] = "Your Perfectrader Authentication Details are ready!!!"
    message = f"{body}"
    msg.attach(MIMEText(message))

    Email = 'authorization@mahalaxmitrade.com'
    password = 'Perfectr@ding'
    
    mailserver = smtplib.SMTP_SSL('smtpout.secureserver.net', 465)
    mailserver.ehlo()
    mailserver.login(Email, password)
    response = mailserver.sendmail(Email,email,msg.as_string())
    mailserver.quit()



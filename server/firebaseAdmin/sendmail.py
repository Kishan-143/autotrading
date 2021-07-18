# Python code to illustrate Sending mail from 
# your Gmail account 
import smtplib

def Send_code(email,username,code):
    subject = "Your Perfectrader Authentication Details are ready!!!"
    body = "Hello from Perfectrader!\n\nYour requested for account was accepted.\n\nYour account Details :- \n \t\tusername :"+ str(username)+"\n\t\tcode:"+str(code) + "\nYou can create account using above credintials."  
    message = f"Subject: {subject}\n\n{body}"

    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    SenderEmail = "perfectrader1415@gmail.com" 
    Password = "tr@der1907"
    s.login(SenderEmail, Password)
    s.sendmail(SenderEmail, email, message)
    s.quit()

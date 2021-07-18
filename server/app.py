import time
import atexit

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask

from apis.user import user
from apis.order import order
from apis.admin import admin
from apis.data import data
from livedata.truedata import Update_live_data


scheduler = BackgroundScheduler()
#scheduler.add_job(func=Update_live_data, trigger="interval", seconds=10)
#scheduler.start()

#atexit.register(lambda: scheduler.shutdown())

app = Flask(__name__,template_folder='templates')

app.register_blueprint(user,url_prefix='/api/user')
app.register_blueprint(order,url_prefix='/api/order')
app.register_blueprint(admin,url_prefix='/api/admin')
app.register_blueprint(data,url_prefix='/api/data')

@app.route('/api')
def hello():
    return "welcome to the flask tutorials"

if __name__ == "__main__":
    app.run(host ='0.0.0.0', port = 5000, debug = True) 




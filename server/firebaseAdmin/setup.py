import firebase_admin
from firebase_admin import credentials
databaseURL = {
     'databaseURL': "https://papertrading-85a14-default-rtdb.firebaseio.com/"
}
firebase_config = {
    "type": "service_account",
    "project_id": "papertrading-85a14",
    "private_key_id": "9c354acfb46188ead00fbee0c6dccdaad822aca0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDIQBz7qaS7Dm/p\nlFEUUv17XoDcU6noTlt5ZGOpf8ONirEE6b+ZE6RvxH6tyuu2+veK/z0Zj1CQCPOU\nDO04iZ8MF5EK4yLpGzWlnjb5CL/jTplFnej1RIyM5V2ODN6fFbZ42VZ1/lJhXiiL\nWhZLQ0GfBYrAc5TWB5rFNNWhx2FWn9iTulRqVVc1wppK2hh0ZHfFffZKS349SYOQ\ntw6atE1fAVvpNZXozjT8Gz/QjohGAFkPBl2qwq44SDAINJE/c6CKksvV13rB1gro\nALT341cTkX/oh8MK1Euk0hkioJ/1wD/RzHDWVAb/GnghX2pBDntED2lZh6qp71E3\ngTwhsJFnAgMBAAECggEARwN9g724XmGTTGk9i5CWtc5gskG1Kl3HULhKI4zcg3Bg\nsFZYjOeLU9uB9Q3WI5DCgndbapoJPtr9zk37PiaH0Zj15b+A3Nu6XZ5K7mus6OYx\nsp96Qqhpk3mvgLWNqSrhB+BDKhrjigYDKM/swgn61nL3rqIOcQxHVZIUBIgZO8dZ\nJSnd40s4vLdCpZQRt+4y2cYKeCmTDMUbSVsZ+pITY+klk91Z0Dm2TUyQiQSGfEaS\nI7F9KlsaUrwtVWZC9ooU25MyHCfg/pC+B3sFQ05SgBhxO9utZLZtfCMia/pvn0TV\n39wJqqX8kl1hQDsncmRlxw2K4/UpEMSLgVw29jR56QKBgQDr0z3WQEvq8t818+J8\nKUVWcC5zoaVD0kxSr4vbAFgG7+yPsSQP38MBF0D35ks2o/c2fyvoe/sh++Cy7CXs\nTz7xwvnecfYb/JpSoO2fkNayJ3tGwHr59d3Jb0JHQAAg0+R/JLdvH5luTCMlfppx\n6oHthZJS0TcUTe/gHsahC7XNGwKBgQDZYcHMeq0xnja6QjUBRKJ5xesVdCPoPfrd\nu64tbVo8336dFew1T5mkoe1InRdRwZ14O9tfoMgt30F5oi41lvYt3Rvur6F4bjex\nW5V+Qwu+PbsSBEvSV1o24d+3dYCzXmRThUkoMVRw18dg8AY3Lwo2DHA5HTcZLKur\naUB07NsNpQKBgQCKizHa+y8euszTv5Iha4WmwIUpvZ9/9r6MHUHGya7tdGrACEut\nX8IKlATBHvS1ByMnSxMapCvnzTg3JXEqIWxTUD7Hpp/11TM8s/qmMctQIs3TxST6\nUK2Zt9lyTnFE1/d3krSJfkD/gY9sabKGlkT6q+xI50y6iwcP3kTHPD/0XQKBgQCK\nmfPxJn7rVg9a7v/Q0SwvLGxZf3WtjGc5nYLO4BxbF70o92NmElzKRZx/YfoOXL7E\nfJXBAUjhRqn+ndOMw7YvQ/2dUEpJ+Sx1XwmQObtxDvcJ48dcU+nneFkmJjtrIlIh\nlqgwglNup4YuXpv373w5PfEH2YLaAEtsvW0loCeDKQKBgCb18x7wFk9gJwc87Mxh\njJF9YFOJXIXtAch/aOAvVES2pHoRIDIA5sy0+2bfVixzMtaTvyQ8TFX6gSPf0lRb\nUZQH/TMswSkv7oRUb5Jr9ykprkOAVj5ziEEmdPVg8c3lU2quYqiEyqVw1zmvKtPj\nWehGU3w7vINnLr2tzQFYZvOE\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-3mnd1@papertrading-85a14.iam.gserviceaccount.com",
    "client_id": "111345268434891094725",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3mnd1%40papertrading-85a14.iam.gserviceaccount.com"
}
cred = credentials.Certificate(firebase_config)
firebase_admin.initialize_app(cred,databaseURL)

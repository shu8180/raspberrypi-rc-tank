# server.py
from flask import Flask, request, render_template
from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler
import time
import RPi.GPIO as GPIO
from logging import getLogger, StreamHandler, DEBUG
logger = getLogger(__name__)
handler = StreamHandler()
handler.setLevel(DEBUG)
logger.setLevel(DEBUG)
logger.addHandler(handler)
logger.propagate = False

app = Flask(__name__)

#IO Pin for Left motor driver
IO_PIN_M1_1 = 15
IO_PIN_M1_2 = 16
#IO Pin for Right motor driver
IO_PIN_M2_1 = 11
IO_PIN_M2_2 = 12

PWM_FREQUENCY_HZ = 100

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD) # Using PIN numbers.
#GPIO.setmode(GPIO.BCM)    # Using GPIO numbers.

# Configuring Left motor
GPIO.setup(IO_PIN_M1_1, GPIO.OUT)
GPIO.setup(IO_PIN_M1_2, GPIO.OUT)
pwmLF = GPIO.PWM(IO_PIN_M1_1, PWM_FREQUENCY_HZ)
pwmLF.start(0)
pwmLR = GPIO.PWM(IO_PIN_M1_2, PWM_FREQUENCY_HZ)
pwmLR.start(0)

# Configuring Right motor
GPIO.setup(IO_PIN_M2_1, GPIO.OUT)
GPIO.setup(IO_PIN_M2_2, GPIO.OUT)
pwmRF = GPIO.PWM(IO_PIN_M2_1, PWM_FREQUENCY_HZ)
pwmRF.start(0)
pwmRR = GPIO.PWM(IO_PIN_M2_2, PWM_FREQUENCY_HZ)
pwmRR.start(0)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/pipe')
def pipe():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']

        while True:
            message = ws.receive()
            #logger.debug('receive message: type=%s, message=%s', type(message), message)
            motorDataStr = message.split(",")
            motorLeftData = int(motorDataStr[0])
            motorRightData = int(motorDataStr[1])

            if (motorLeftData >= 0):
                pwmLF.ChangeDutyCycle(motorLeftData)
                pwmLR.ChangeDutyCycle(0)
            else:
                pwmData = motorLeftData * (-1)
                pwmLF.ChangeDutyCycle(0)
                pwmLR.ChangeDutyCycle(pwmData)

            if (motorRightData >= 0):
                pwmRF.ChangeDutyCycle(motorRightData)
                pwmRR.ChangeDutyCycle(0)
            else:
                pwmData = motorRightData * (-1)
                pwmRF.ChangeDutyCycle(0)
                pwmRR.ChangeDutyCycle(pwmData)

            #ws.send(message)


def main():
    app.debug = True
    server = pywsgi.WSGIServer(("", 8080), app, handler_class=WebSocketHandler)
    server.serve_forever()


if __name__ == "__main__":
    main()

# MicroPython for LEGO Hardware (LEGO Education's SPIKE Prime)
from spike import PrimeHub, LightMatrix, Button, StatusLight, ForceSensor, MotionSensor, Speaker, ColorSensor, App, DistanceSensor, Motor, MotorPair
from spike.control import wait_for_seconds, wait_until, Timer



hub = PrimeHub()
speed = 60
armSpeed = 100
chopMotor = Motor ('B')
power = 100

#motor C should be on the right and motor E should be on the left
arm = MotorPair ('C', 'E')
arm1 = Motor('C')
arm2 = Motor ('E')

distance = DistanceSensor ('F')
distance.light_up_all(50)    
    
'''
def moveArms():
    
    arm1.start_at_power(-1 * power)
    arm2.start_at_power(power)
    
    wait_for_seconds(1)
    arm1.start_at_power(power)
    arm2.start_at_power(-1 * power)
    
    wait_for_seconds(1)

    arm1.stop()
    arm2.stop()

'''

def isInDistance():
    if (distance.get_distance_cm(True) == None):
        return False;
    return (distance.get_distance_cm(True) < 15)


chopMotor.run_to_position(0, 'shortest path', speed)



while (True):
    print(isInDistance())
    while (isInDistance() == False):
        chopMotor.start_at_power(-1*speed)
        for i in range (20):
            yield(100)
            if (isInDistance()):
                break
        chopMotor.start_at_power(speed)
        for i in range (20):
            yield(100)
            if (isInDistance()):
                break
    chopMotor.stop()
    #moveArms()
    yield (5000)
    
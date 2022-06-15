var pythonCode2 = `
# MicroPython for LEGO Hardware (LEGO Education's SPIKE Prime)
from spike import PrimeHub, LightMatrix, Button, StatusLight, ForceSensor, MotionSensor, Speaker, ColorSensor, App, DistanceSensor, Motor, MotorPair
from spike.control import wait_for_seconds, wait_until, Timer



hub = PrimeHub()
speed = 60
power = 100

#motor C should be on the right and motor E should be on the left
arm = MotorPair ('C', 'E')
arm1 = Motor('C')
arm2 = Motor ('E')

distance = DistanceSensor ('F')  
    

def moveArms():
    
    arm1.start_at_power(-1 * power)
    arm2.start_at_power(power)
    
    wait_for_seconds(1)
    arm1.start_at_power(power)
    arm2.start_at_power(-1 * power)
    
    wait_for_seconds(1)

    arm1.stop()
    arm2.stop()



def isInDistance():
    if (distance.get_distance_cm() == None):
        return False;
    return (distance.get_distance_cm() < 40)






while (True):
    
    distance.wait_for_distance_closer_than(50, 'cm')
    yield(50)
    moveArms()
    yield (1000)
    





`
// setup
try{
    if (getCookie("fun") == "true"){
        window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
}
catch(error){
    console.log("No Cookies stored");
}

document.addEventListener('keyup', playScream);

var mainimage = document.getElementById("mainimage");
var animationimage = document.getElementById("animationimage");
var force_sensor = null;
var force_threshold = 5; // how hard to push to trigger response
var chopStatus = false;

// setup SPIKE Service Dock
var mySPIKE = document.getElementById("service_SPIKE").getService();
var mySPIKE2 = document.getElementById("service_SPIKE2").getService();

mySPIKE.executeAfterInit(async function() {
    // start polling for touch sensor
    //force_sensor = new mySPIKE.ForceSensor("A");
    //poll_touch_sensor();
    

    reload_diagnostics(); //loads sensor data into the diagnostic panel
    mySPIKE.writeProgram("code.py", pythonCode, 1);
    
    

});


function helloWorld(){
    console.log("hello world!");
}

function poll_touch_sensor() {
    // get touch sensor value:
    var touch_val = force_sensor.get_force_newton();
    if (touch_val > force_threshold) {
        do_pop();
    } else {
        // no touch, so check again (in a bit)
        setTimeout(poll_touch_sensor, 200);
    }
}
function do_pop() {
    mainimage.style.display = "none";
    animationimage.style.display = "block";
    animationimage.src = "screamPic.jpg"; // this will load image and play gif
    setTimeout(play_audio, 100); // slight delay to try and line up sound with image
    setTimeout(reset_images, 2000);
    // start monitoring again
    setTimeout(poll_touch_sensor, 2000);
}
function play_audio() {
    var audio = document.getElementById("sound");
    audio.play();
}
// reset back to original page load (show static image, hide gif)
function reset_images() {
    mainimage.style.display = "block";
    animationimage.style.display = "none";
    animationimage.src = ""; // clearing src will force reload next time
}



//Loads diagnostic values into sensor data box
function reload_diagnostics() {
    var ports = [];

    //sm = small motor, lm = large motor, us = ultrasonic sensor
    //fs = force sensor, cs = color sensor
    var portTypes = ['sm', 'lm', 'us', 'fs', 'cs'];

    //checks what ports sensors are plugged into
    var smallMotors = mySPIKE.getSmallMotorPorts();
    var largeMotors = mySPIKE.getBigMotorPorts();
    var ultrasonicSensor = mySPIKE.getUltrasonicPorts();
    var forceSensor = mySPIKE.getForcePorts();
    var colorSensor = mySPIKE.getColorPorts();

    //If small motors are connected
    if (smallMotors.length > 0){
        var smDisplay = document.getElementById("smallMotor");
        smDisplay.innerHTML = "Small motor(s) attached at port(s): " + smallMotors + "<br>";

        //Note: Large Motor functions work for small motors
        smDisplay.innerHTML += "<button onClick = startLargeMotor('" + smallMotors[0] + "')> Start Small Port " + smallMotors[0] + "</button> ";
        smDisplay.innerHTML += "<button onClick = stopLargeMotor('" + smallMotors[0] + "')> Stop Small Port " + smallMotors[0] + "</button> <br><br>";
        
        if (smallMotors.length > 1){
            smDisplay.innerHTML += "<button onClick = startLargeMotor('" + smallMotors[1] + "')> Start Small Motor Port " + smallMotors[1] + "</button> ";
            smDisplay.innerHTML += "<button onClick = stopLargeMotor('" + smallMotors[1] + "')> Stop Small Motor Port " + smallMotors[1] + "</button> <br><br>";
        }
    }
    else{
        document.getElementById("smallMotor").innerHTML = "";
    }
    ports.push(smallMotors);

    //Similar to small motor code, only works with one large motor (so far)
    if (largeMotors.length > 0){
        var lmDisplay = document.getElementById("largeMotor");
        lmDisplay.innerHTML = "Large motor(s) attached at port(s): " + largeMotors + "<br>";
        lmDisplay.innerHTML += "<button onClick = startLargeMotor('" + largeMotors[0] + "')> Start Large Motor </button> ";
        lmDisplay.innerHTML += "<button onClick = stopLargeMotor('" + largeMotors[0] + "')> Stop Large Motor </button> <br><br>";
        
        var chopButton = document.getElementById('chopButton');
        chopButton.setAttribute("onclick","alwaysChop();");
        
    }
    else{
        document.getElementById("largeMotor").innerHTML = "";
    }
    ports.push(largeMotors);
    
    if (ultrasonicSensor.length > 0){
        var us = document.getElementById("ultrasonic");
        us.innerHTML = "Ultrasonic sensor attached at port(s): " + ultrasonicSensor + "<br><br>";
        us.innerHTML += "<button onClick = setBrightnessUS('" + ultrasonicSensor[0] + "')> Set Light Brightness </button> <br><br>";
    }
    else{
        document.getElementById("ultrasonic").innerHTML = "";
    }
    ports.push(ultrasonicSensor);

    if (forceSensor.length > 0){
        var fs = document.getElementById("force");
        fs.innerHTML = "Force sensor attached at port(s): " + forceSensor + "<br><br>";
        

    }
    else{
        document.getElementById("force").innerHTML = "";
    }
    ports.push(forceSensor);

    if (colorSensor.length > 0){
        document.getElementById("color").innerHTML = "Color sensor attached at port(s): " + colorSensor + "<br><br>";
    }
    else{
        document.getElementById("color").innerHTML = "";
    }
    ports.push(colorSensor);

    return ports;

}

//IMPORTANT: START ARM IN DOWNWARD POSITION!!!

function chopHands (port){

    /*

    var motor = new mySPIKE.Motor(port);
    motor.set_stall_detection(true);

    
    var startDeg = 0;
    var powerLevel = 30;
    var curDeg = motor.get_position();
    
    setTimeout(() => {  
        motor.run_to_degrees_counted(-90, powerLevel, "done");
            
        setTimeout(() => {  
            motor.run_to_degrees_counted(0, powerLevel, "done"); 
            setTimeout(() => {motor.stop();}, 1500)
        }, 1500);
    }, 1500);
    */
}

function extendHub1Arms(){
    var arm1 = new mySPIKE.Motor('C');
    var arm2 = new mySPIKE.Motor('E');
    var distance2 = new mySPIKE2.DistanceSensor('F');
    
    
    if (distance2.get_distance_cm() < 10 && Number.isInteger(distance2.get_distance_cm())){
        arm1.start_at_power(-100);
        arm2.start_at_power(100);
        document.getElementById("sound").play();

        document.getElementById('mainimage').src = "./skull.jpg";

        setTimeout(() => {
            arm1.start_at_power(100);
            arm2.start_at_power(-100);
            setTimeout(() => {
                document.getElementById('mainimage').src = "https://live.staticflickr.com/1327/5144862325_cfd190ee12_b.jpg";
                arm1.stop();
                arm2.stop();
            }, 1000);
        }, 1000);

        setTimeout(() =>{
            extendHub1Arms();
    
        } , 1000);
        
    }

    else{
        setTimeout(() =>{
            extendHub1Arms();
    
        }, 50) 
    
    }
    
}

    
function alwaysChop(){
    var distance2 = new mySPIKE2.DistanceSensor('F');
    
    console.log(distance2.get_distance_cm())

    mySPIKE.executeProgram(1);
    mySPIKE2.executeProgram(0);

    setInterval(extendHub1Arms(), 300);


}

function stopCode(){
    mySPIKE.stopCurrentProgram();
    mySPIKE2.stopCurrentProgram();
}

function reboot(){
    mySPIKE.rebootHub();
    mySPIKE2.rebootHub();
}


function startLargeMotor(port){
    var motor = mySPIKE.Motor(port);
    var power = prompt("Enter a motor power level: ");
    motor.start_at_power(power);
}

function stopLargeMotor(port){
    clearInterval(chopInt);
    var motor = mySPIKE.Motor(port);
    motor.stop();
}

function setBrightnessUS (port){
    var ultrasonic = mySPIKE.DistanceSensor(port);
    var brightness = prompt("Enter a brightness level");
    ultrasonic.light_up_all(brightness);
}


//Diagnostic Box
function show_diagnostics() {
    var diagBox = document.getElementById("diag");
    document.getElementById("diagnosticsOn").style.display = "none";
    document.getElementById("diagnosticsOff").style.display = "block";
    document.getElementById("topToolbar_container").hidden = false;
    document.getElementById("topToolbar_container2").hidden = false;
    document.getElementById("sensorData").hidden = false;
    reload_diagnostics();
    
}

function hide_diagnostics() {
    var diagBox = document.getElementById("diag");
    document.getElementById("diagnosticsOn").style.display = "block";
    document.getElementById("diagnosticsOff").style.display = "none";
    document.getElementById("topToolbar_container").hidden = true;
    document.getElementById("topToolbar_container2").hidden = true;
    document.getElementById("sensorData").hidden = true;
}

function playScream(){
    document.getElementById('sound').play();
}



//returns distance in cm fom spike prime
//distance sensor needs to be in correct port
/*
function getDistance(){
    var distance_sensor = new serviceSPIKE.DistanceSensor("A");
    return (distance_sensor.get_distance_cm());
}
*/


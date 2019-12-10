let UIHolder = document.createElement("span");
UIHolder.id = "ui-holder";
document.body.appendChild(UIHolder);

function createNewClickyButton(x, y, value, upFunc, downFunc, label=0) { // label default is 0
    let wrapper = document.createElement("div");
    let button1 = document.createElement("button");
    let button2 = document.createElement("button");
    let valueField = document.createElement("p");
    let msgField = document.createElement("p");
// I scaled everything down by 0.75 because they were too big
    wrapper.className = "adjuster"; // note that most styles are in the bouncing-page-style.css file
    wrapper.style.width = 60+(label.length*12)+"px";
    wrapper.style.position = "absolute";
    wrapper.style.top = y+"px";
    wrapper.style.left = x+"px";

    button1.innerHTML = "+";
    button1.style.position = "relative";
    button1.style.top = "-10.4px"; // IDKY but this is the right number

    button2.innerHTML = "-";
    button2.style.position = "relative";
    button2.style.top = "-40.2px"; // this number works for some reason

    valueField.innerHTML = value;
    valueField.className = "value";
    valueField.style.position = "relative";
    valueField.style.top = "-15.5px"; // again, it works

    msgField.innerHTML = label;
    msgField.className = "label";
    msgField.style.width = (label.length*12)+"px"; // This isn't perfect, so don't make your label too obnoxious or it will break
    msgField.style.position = "relative";
    msgField.style.top = "-59.75px"; // another number that works -- since the <p> tags are supposed to be on their own line, this gets messed up

    UIHolder.appendChild(wrapper);
    wrapper.appendChild(button1);
    wrapper.appendChild(valueField);
    wrapper.appendChild(button2);
    if (label) { // if there is a label (not 0)
        wrapper.appendChild(msgField);
    }

    if (upFunc) button1.addEventListener("click", upFunc); // couldn't get onclick to accept a string so this works
    if (downFunc) button2.addEventListener("click", downFunc); // if there is a downFunc, start listening
}

function newExtraButton(x, y, msg, fun) { // -x = from right, -y = from bottom
    let btn = document.createElement("button");
    
    btn.className = "extra-button";
    btn.style.position = "absolute";
    if (y >= 0) {
        btn.style.top = y+"px";
    } else {
        btn.style.bottom = -y+"px";
    }
    if (x >= 0) {
        btn.style.left = x+"px";
    } else {
        btn.style.right = -x+"px";
    }
    btn.innerHTML = msg;

    UIHolder.appendChild(btn);
    btn.addEventListener("click", fun);
}

function scaleScreenSize() {
    let adjustUis = document.getElementsByClassName("adjuster");
    let buttonUis = document.getElementsByClassName("extra-button");
    let infoBoxUi = document.getElementById("info-popup");

    let scaleFactor = (window.innerWidth*window.innerHeight)/800000+0.2;

    for (let i = 0; i < adjustUis.length; i++) {
        adjustUis[i].style.transform = "scale("+scaleFactor+")"; // technically if there are any other transformations, it should be +=
        adjustUis[i].style.transformOrigin = "top left"; // still need to move x y
        adjustUis[i].style.top = UIButtons[i].y*(scaleFactor)+"px";

        //adjustUis[i].style.top = (adjustUis[i].style.top.substr(0, adjustUis[i].style.top.length-2))*scaleFactor+"px"; // remove "px" suffix, cal, and add "px" back on
        //let oStyleLeft = adjustUis[i].style.left.substr(0, adjustUis[i].style.left.length-2);
        //adjustUis[i].style.left = oStyleLeft - (oStyleLeft*scaleFactor) + "px";
    }
    for (let i = 0; i < buttonUis.length; i++) {
        buttonUis[i].style.transform = "scale("+scaleFactor+")";
        buttonUis[i].style.transformOrigin = "top left"; // still need to move x y
        if (buttonUis[i].style.left) buttonUis[i].style.left = extraButtonList[i].x*(0.1+scaleFactor*0.85)+"px"; // cheat but it works
        if (buttonUis[i].style.right) buttonUis[i].style.right = -extraButtonList[i].x*(scaleFactor*1.3)+"px";
    }
    buttonUis[0].style.top = extraButtonList[0].x*(scaleFactor*0.15)+"px"; // only the 0th value in array needs to be changed
    if (scaleFactor > 0.65) {
        infoBoxUi.style.fontSize = scaleFactor*15+"px";
        infoBoxUi.style.height = "";
    } else {
        infoBoxUi.style.height = "50%";
        infoBoxUi.style.fontSize = "12px";
    }
}

function makeInfoPanels() {
    let infoButton = document.createElement("button");
    let infoBox = document.createElement("p");

    infoButton.id = "info-button";
    infoButton.innerHTML = "?";

    infoBox.id = "info-popup";
    infoBox.style.visibility = "hidden";
    infoBox.innerHTML = "Amount of balls - Changes the amount of balls on the screen. Increasing the amount will spawn a new random ball.<br><br>Circle trail level - The distance that a trail will be left behind each ball. A value of 10 will have trails that do not disappear.<br><br>Ball interaction mode - 0: Balls do not interact 1: Balls swap colors 2: Balls become the same color 3: Balls bounce off of each other<br><br>Gravity level - Specifies how much simulation gravity is outputted on each ball (this number is a constant, not a realistic percentage, so their bounces will be perfect arcs). When gravity is on, balls are allowed to fly offsreen (top only).<br><br>Note that this isn't perfect and balls will sometimes get stuck. Press \"Regenerate balls\" to fix this.<br>Also, if you want to share your current game mechanics settings, just copy the full url in the address bar.<p style='margin: 1em 0 0 0; text-align:center'>Click to hide info box.</p>";

    UIHolder.appendChild(infoButton);
    UIHolder.appendChild(infoBox);

    infoButton.addEventListener("click", function() { function hideInfoBox(evt) { if(evt.clientX >= 21 || evt.clientY >= 21) {infoBox.style.visibility = "hidden"; window.removeEventListener("click", hideInfoBox);} } infoBox.style.visibility = "visible"; window.addEventListener("click", hideInfoBox); });
}

var UIButtons = [
    {
        x: 25,
        y: 25,
        value: ballsToMake, // updated by id selector in updateBallCount
        upFunc: function() { ballsToMake++; updateBallCount(); this.nextSibling.innerHTML = balls.length; },
        downFunc: function() { if (ballsToMake > 0) {ballsToMake--; updateBallCount(); this.previousSibling.innerHTML = balls.length;} },
        label: "Amount of balls"
    },
    {
        x: 25,
        y: 100,
        value: 10-ballTrail*10,
        upFunc: function() { if (ballTrail > 0.1) {ballTrail -= 0.1; this.nextSibling.innerHTML = Math.round(10-ballTrail*10); saveUrlData();} }, // have to round because ballTrail becomes a weird number
        downFunc: function() { if (ballTrail <= 0.9) {ballTrail += 0.1; this.previousSibling.innerHTML = Math.round(10-ballTrail*10); saveUrlData();} },
        label: "Circle trail level"
    },
    {
        x: 25,
        y: 175,
        value: ballCollisionType,
        upFunc: function() { if (ballCollisionType < 3) {ballCollisionType++; this.nextSibling.innerHTML = ballCollisionType; saveUrlData();} },
        downFunc: function() { if (ballCollisionType > 0) {ballCollisionType--; this.previousSibling.innerHTML = ballCollisionType; saveUrlData();} },
        label: "Ball interaction mode"
    },
    {
        x: 25,
        y: 250,
        value: ballGravity,
        upFunc: function() { ballGravity += 0.1; this.nextSibling.innerHTML = Math.round((ballGravity*10))/10; saveUrlData(); },
        downFunc: function() { if (ballGravity > 0 && ballGravity < 0.2) { ballGravity = 0; /* check for OS balls */ for (var i = 0; i < balls.length; i++){if(balls[i].y<balls[i].size){balls[i].y=balls[i].size+1;}} this.previousSibling.innerHTML = Math.round((ballGravity*10))/10; saveUrlData(); } else if (ballGravity >= 0.1) { ballGravity -= 0.1; this.previousSibling.innerHTML = Math.round((ballGravity*10))/10; saveUrlData(); } },
        label: "Gravity level"
    }
];
var extraButtonList = [
    {
        x: 290,
        y: 45,
        msg: "Regenerate balls",
        fun: function() { let rememberThis = ballsToMake; ballsToMake = 0; updateBallCount(); ballsToMake = rememberThis; updateBallCount(); }
    },
    {
        x: -10,
        y: 10,
        msg: "Hide UI",
        fun: function() { document.getElementById("ui-holder").style.visibility = "hidden"; let showUiButt = document.createElement("p"); showUiButt.id = "white-corner-link"; showUiButt.innerHTML = "Show UI"; document.body.appendChild(showUiButt); function topCornerMouseDetect(evt) { if (evt.clientX > (window.innerWidth-100) && evt.clientY < 65) { document.getElementById("white-corner-link").style.visibility = "visible"; } else { document.getElementById("white-corner-link").style.visibility = "hidden"; } } window.addEventListener("mousemove", topCornerMouseDetect); showUiButt.addEventListener("click", function() { document.getElementById("ui-holder").style.visibility = "visible"; window.removeEventListener("mousemove", topCornerMouseDetect); document.body.removeChild(this); }); }
    },
    {
        x: -75,
        y: 10,
        msg: "Fullscreen",
        fun: function() { if (!document.fullscreenElement) { document.body.requestFullscreen(); } else { document.exitFullscreen(); } }
    }
]

for (let i = 0; i < UIButtons.length; i++) {
    createNewClickyButton(UIButtons[i].x, UIButtons[i].y, UIButtons[i].value, UIButtons[i].upFunc, UIButtons[i].downFunc, UIButtons[i].label);
}
for (let i = 0; i < extraButtonList.length; i++) {
    newExtraButton(extraButtonList[i].x, extraButtonList[i].y, extraButtonList[i].msg, extraButtonList[i].fun);
}
makeInfoPanels();

// also need to also optimize infobox for small screensize
scaleScreenSize(); // now that everything is made, scale it all
window.addEventListener("resize", scaleScreenSize); // and do that everytime the screen size changes

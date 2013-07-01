var subject = "";
var cards = document.getElementsByClassName("animatedCard");
var spinButton = document.getElementById("spin_button");
var cardFaceText = ["do", "as"];

var steps = 40;
var swapface1 = steps / 4;
var swapface2 = 3 * steps / 4;

var anglestep = (2 * Math.PI / steps);
var perspectiveOffset = Math.PI / 2;
var perspectivePinch = 20;

var animationStep = 0;
var startSpeed = 40;
var speed = startSpeed;
var stopped = true;


 
var sound = new Audio("http://www.richardmillwood.net/s&t/shake-and-teach-cardFlipSound.wav");
sound.preload = 'auto';
sound.load();

function playcardFlipSound() {
  var click=sound.cloneNode();
  click.play();
}


function random_do_text(subject) {
    return "Do " + do_text[Math.floor(Math.random() * do_text.length)];
}


function random_as_text() {
    return "as " + as_text[Math.floor(Math.random() * as_text.length)];
}


function random_text(i) {
    if (i == 0) {
        return random_do_text(subject)
    } else {
        return random_as_text(subject)
    }
}


function animate(cards) {
    var t;
    speed -= 0.4;
    for (var i = 0; i < cards.length; i++) {
        card = cards.item(i);
        if (animationStep == swapface1) {
            card.querySelector(".cardOutline").setAttribute("fill", "aliceblue");
            card.querySelector(".cardFace").textContent = random_text(i);
            card.querySelector(".cardFace").setAttribute("style", "font-size: 18px; color: black; font-weight: normal; font-style: normal; stroke: black; text-align: center; vertical-align: middle;");
            card.querySelector(".cardFace").setAttribute("transform", "matrix(1 0 0 -1 0 0)");
            playcardFlipSound();

        }
        if (animationStep == swapface2) {
            card.querySelector(".cardOutline").setAttribute("fill", "steelblue");
            card.querySelector(".cardFace").textContent = cardFaceText[i];
            card.querySelector(".cardFace").setAttribute("style", "font-size: 96px; color: white; font-weight: bold; font-style: italic; stroke: black; text-align:center; vertical-align: middle;");
            card.querySelector(".cardFace").setAttribute("transform", "matrix(1 0 0 1 0 0)");
            playcardFlipSound();

        }
        angle = animationStep * anglestep;
        squashHeight = Math.cos(angle);
        perspectivePinchX = perspectivePinch * Math.cos(angle + perspectiveOffset);
        
        card.setAttribute("transform", "matrix(" + 1 + "," + 0 + "," + 0 + "," + squashHeight + "," + 0 + "," + 0 + ")");
        
        card.querySelector(".cardOutline").setAttribute("d", "m" + (-150 + perspectivePinchX / 2) + ",-60 c0,-10 10,-20 20,-20 l" + (260 - perspectivePinchX) + ",0 c10,0 20,10 20,20 l" + perspectivePinchX + ",120 c0,10 -10, 20 -20, 20 l" + (-260 - perspectivePinchX) + ",0 c-10,0 -20,-10 -20,-20 l" + perspectivePinchX + ",-120z");
    }
    animationStep += 1;
    if (animationStep == steps) {
        animationStep = 0;
        }
    t = startSpeed - speed;
    if (speed > 0) {
        window.setTimeout("animate(cards)", t);
        } else {
        spinButton.textContent = "Spin!";
        spinButton.style.backgroundColor = "LawnGreen";
        stopped = true;
        }
}


// This function either starts the cards spinning or stops them
function spin() {
    if (stopped) {
        animationStep = 0;
        speed = startSpeed;
        stopped = false;
        window.setTimeout("animate(cards)", 1);
        spinButton.textContent = "Stop!";
        spinButton.style.backgroundColor = "Red";
        playcardFlipSound();
    } 
    else {
        speed = 10;
    }
}


// This function sets the global subject variable from the selection
function set_subject(selection) {
    subject = selection;
    document.getElementById("current_subject").innerHTML = subject;
}


// This function navigates between pages of the app by hiding most and revealing one
function navigateToAppPage(appPageId) {
    var appPages = document.getElementsByClassName('appPage');
    for (var i = 0; i < appPages.length; i++) {
        if (appPages[i].id == appPageId) {
            appPages[i].style.display = "block";
        } 
        else {
            appPages[i].style.display = "none";
        }
    }
}

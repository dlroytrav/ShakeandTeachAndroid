var subject = "All"; // default
var cards = document.getElementsByClassName("animatedCard");
var spinButton = document.getElementById("spin_button");
var cardFaceText = [ "do", "as" ];

var lastAppPageID = null;

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

var mobile = true;

build_subjects_menu();

// var sound = new
// Audio("http://www.richardmillwood.net/s&t/shake-and-teach-cardFlipSound.wav");
// sound.preload = 'auto';
// sound.load();

function playcardFlipSound() {
	// var click=sound.cloneNode();
	// click.play();
}

function build_subjects_menu() {
	var subjects = new Array();
	subject_menu = document.getElementById("choose_subject_select");
	option = document.createElement("option");
	option.text="All";
	subject_menu.add(option,null);
	subjects[0] = "All";
	for ( var i = 0; i < do_text.length; i++) {
		subject = do_text[i][0];
		if (subjects.indexOf(subject) == -1) {
			subjects.push(subject);
			option=document.createElement("option");
			option.text=subject;
			subject_menu.add(option,null);
		}
	}
	subject = "All"; // default
}

function random_do_text() {
	do {
		d = do_text[Math.floor(Math.random() * do_text.length)];
	} while ((subject != "All") && (subject != d[0]));

	return "Do " + d[1];
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
	for ( var i = 0; i < cards.length; i++) {
		card = cards.item(i);
		if (animationStep == swapface1) {
			card.querySelector(".cardOutline").setAttribute("fill", "White");
			card.querySelector(".cardFace").textContent = random_text(i);
			card.querySelector(".cardFace").setAttribute("style","font-size: 150%; color: white; font-weight: normal; font-style: normal; stroke: black; text-align: center; vertical-align: middle;");
			card.querySelector(".cardFace").setAttribute("transform",
					"matrix(1 0 0 -1 0 0)");
			playcardFlipSound();

		}
		if (animationStep == swapface2) {
			card.querySelector(".cardOutline").setAttribute("fill", "#0071C5");
			card.querySelector(".cardFace").textContent = cardFaceText[i];
			card
					.querySelector(".cardFace")
					.setAttribute(
							"style",
							"font-size: 600%; color: white; font-weight: bold; font-style: italic; stroke: black; text-align:center; vertical-align: middle;");
			card.querySelector(".cardFace").setAttribute("transform",
					"matrix(1 0 0 1 0 0)");
			playcardFlipSound();

		}
		angle = animationStep * anglestep;
		squashHeight = Math.cos(angle);
		perspectivePinchX = perspectivePinch
				* Math.cos(angle + perspectiveOffset);

		card.setAttribute("transform", "matrix(" + 1 + "," + 0 + "," + 0 + ","
				+ squashHeight + "," + 0 + "," + 0 + ")");

		card.querySelector(".cardOutline").setAttribute(
				"d",
				"m" + (-150 + perspectivePinchX / 2)
						+ ",-60 c0,-10 10,-20 20,-20 l"
						+ (260 - perspectivePinchX) + ",0 c10,0 20,10 20,20 l"
						+ perspectivePinchX + ",120 c0,10 -10, 20 -20, 20 l"
						+ (-260 - perspectivePinchX)
						+ ",0 c-10,0 -20,-10 -20,-20 l" + perspectivePinchX
						+ ",-120z");
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
		shake.startWatch(spin);
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
		shake.stopWatch();
	} else {
		speed = 10;
	}
}

// This function sets the global subject variable from the selection
function set_subject(selection) {
	subject = selection;
	document.getElementById("current_subject").innerHTML = subject;
}

// This function navigates between pages of the app by hiding most and revealing
// one
function navigateToAppPage(appPageID) {
	if (appPageID != lastAppPageID) {
		lastAppPageID = appPageID;
		var appPages = document.getElementsByClassName("appPage");
		for ( var i = 0; i < appPages.length; i++) {
			if (appPages[i].id == appPageID) {
				appPages[i].style.display = "block";
				if ((appPages[i].id == "sandt") && (mobile)) {
					shake.startWatch(spin)
				}
			} else {
				appPages[i].style.display = "none";
				if ((appPages[i].id == "sandt") && (mobile)) {
					shake.stopWatch()
				}
			}
		}
	}
}

var shake = (function() {
	var shake = {}, watchId = null, options = {
		frequency : 1000
	}, shakeCallBack = null;

	// Start watching the accelerometer for a shake gesture
	shake.startWatch = function(onShake) {
		shakeCallBack = onShake;
		watchId = navigator.accelerometer.watchAcceleration(
				getAccelerationSnapshot, handleError, options);

	};

	// Stop watching the accelerometer for a shake gesture
	shake.stopWatch = function() {
		if (watchId !== null) {
			navigator.accelerometer.clearWatch(watchId);
			watchId = null;
		}
	};

	// Gets the current acceleration snapshot from the last accelerometer watch
	function getAccelerationSnapshot() {
		navigator.accelerometer.getCurrentAcceleration(
				assessCurrentAcceleration, handleError);
	}

	// Assess the current acceleration parameters to determine a shake
	function assessCurrentAcceleration(acceleration) {

		if (acceleration.x > 2) {
			// Shake detected
			shakeCallBack();
			shake.stopWatch();
			setTimeout(shake.startWatch, 1000, shakeCallBack);
		}
	}

	// Handle errors here
	function handleError() {
		navigator.notification.alert("shake error");
	}

	return shake;
})();

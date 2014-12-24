/**
 * Year
 */
var d = new Date();
$("span#picturit-date").text(d.getFullYear());

/**
 * Canvas background
 */
///// http://thecodeplayer.com/walkthrough/html5-canvas-snow-effect
var canvas = $("canvas#background").get(0);
var ctx = canvas.getContext("2d");

//canvas dimensions
var W = $(window).width();
var H = $(window).height();
canvas.width = W;
canvas.height = H;

//snowflake particles
var mp = 50; //max particles
var particles = [];
for (var i = 0; i < mp; i++) {
	particles.push({
		x : Math.random() * W, //x-coordinate
		y : Math.random() * H, //y-coordinate
		r : Math.random() * 4 + 1, //radius
		d : Math.random() * mp //density
	})
}

//Lets draw the flakes
function draw() {
	ctx.clearRect(0, 0, W, H);

	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.beginPath();
	for (var i = 0; i < mp; i++) {
		var p = particles[i];
		ctx.moveTo(p.x, p.y);
		ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
	}
	ctx.fill();
	update();
}

//Function to move the snowflakes
//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
var angle = 0;
function update() {
	angle += 0.01;
	for (var i = 0; i < mp; i++) {
		var p = particles[i];
		//Updating X and Y coordinates
		//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
		//Every particle has its own density which can be used to make the downward movement different for each flake
		//Lets make it more random by adding in the radius
		p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
		p.x += Math.sin(angle) * 2;

		//Sending flakes back from the top when it exits
		//Lets make it a bit more organic and let flakes enter from the left and right also.
		if (p.x > W + 5 || p.x < -5 || p.y > H) {
			if (i % 3 > 0) //66.67% of the flakes
			{
				particles[i] = {
					x : Math.random() * W,
					y : -10,
					r : p.r,
					d : p.d
				};
			} else {
				//If the flake is exitting from the right
				if (Math.sin(angle) > 0) {
					//Enter from the left
					particles[i] = {
						x : -5,
						y : Math.random() * H,
						r : p.r,
						d : p.d
					};
				} else {
					//Enter from the right
					particles[i] = {
						x : W + 5,
						y : Math.random() * H,
						r : p.r,
						d : p.d
					};
				}
			}
		}
	}
}

//animation loop
setInterval(draw, 33);

$(window).resize(function () {
	W = $(window).width();
	H = $(window).height();
	canvas.width = W;
	canvas.height = H;
});

/**
 * Hax. Todo: work around
 */
$("form#image_upload").remove().appendTo($("#header-right"));

/**
 * Init
 */
$(".loading").delay(1000).fadeOut(100, function(){
	$(".loading-hidden").slideDown();
});

/**
 * Notification function
 */
function notify(text){
	$("#notification").text(text).fadeIn().delay(5000).fadeOut();
}

/**
 * File drop
 */
// to be implemented
 
/**
 * Image uploading via ajax
 */
 
var current_files = [];
$("form#image_upload input[type=file]").change(function (e) {
	var evt = e.originalEvent;
	var files = evt.target.files; // to do: fallback if not supported
	for (var i = 0, f; f = files[i]; i++) {
		if (!f.type.match('image.*')) {
			notify("Your file "+f.name+" doesn't seem to be an image or is corrupted.");
			continue;
		}
		current_files.push(f);
		var size = 0;
		for(temp_file in current_files){
			size += current_files[temp_file].size;
		}
		
		if(size > 8388608){
			notify("An image was not added because it would bring the total size past 8MB. Remove some images and try again, or upload more images later.");
			break;
		}
		
		var reader = new FileReader();
		reader.onload = (function (theFile) {
			return function (e1) {
				$("#preview-div br").remove();
				$("form#image_upload p").text("Add More");
				var img = $("<img />").addClass("preview").attr("src", e1.target.result).css("display", "none");
				$("<div><span class='helper'></span></div>").addClass("preview-container").append(img).appendTo($("#preview-div")).css("display", "none").fadeIn();
				img.slideDown();
			};
		})(f);
		reader.onerror = function(){
			notify("Error: Unable to read your file "+f.name+". Sorry!");
		};
		reader.readAsDataURL(f);
	}
});

$("form#image_upload").submit(function (e) {
	e.preventDefault();
	var formData = new FormData($(this)[0]);
	$("#upload_progress").show();
	$.ajax({
		url : "upload.php",
		type : 'POST',
		data : formData,
		async : true,
		xhr : function () {
			var xhr = jQuery.ajaxSettings.xhr();
			if (xhr instanceof window.XMLHttpRequest) {
				xhr.upload.addEventListener("progress", function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded * 100 / evt.total;
						console.log("Progress: ", percentComplete);
						$("#upload_progress").attr("max", "100").attr("value", percentComplete);
					}
				}, false);
			}
			return xhr;
		},
		success : function (data) {
			$("#upload_progress").hide();
			$("#json_response").text(JSON.stringify(data));
			$("[name=userfile]").val("");
		},
		error : function () {
			$("#upload_progress").hide();
			$("#json_response").text("Sorry! Something bad happened and your image wasn't uploaded. Check your internet connection and try again.");
		},
		cache : false,
		contentType : false,
		processData : false
	});
	return false;
});

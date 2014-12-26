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
if(window.File && window.FormData){
	$(".loading").delay(2000).fadeOut(100, function () {
		$(".loading-hidden").slideDown();
	});
} else {
	$("form#image_upload").hide();
	$("#error_no_apis").slideDown();
	$(".loading").hide();
}

/**
 * Utility functions
 */
function notify(text) {
	$("#notification").text(text).fadeIn().delay(5000).fadeOut();
}
function getSize(size) {
	if (size < 1000) {
		return size + " B";
	}
	if (size < 100000) {
		return Math.floor(size / 1000) + " KB";
	}
	if (size < 10000000) {
		return (Math.floor(size / 100000) / 10) + " MB";
	} else
		return "Too big!";
}

function getName(name) {
	if (name.length <= 10)
		return name;
	if (name.indexOf(".") < 0)
		return name.substring(0, 7) + "...";
	var idx = name.lastIndexOf(".");
	var ext = name.substring(idx);
	var file = name.substring(0, idx);
	return file.substring(0, 8 - ext.length) + ".." + ext;
}

/**
 * File drop
 */
// to be implemented

/**
 * Image uploading via ajax
 */

var current_files = {};
var file_map = {};
$("form#image_upload input[type=file]").change(function (e) {
	var evt = e.originalEvent;
	var files = evt.target.files; // to do: fallback if not supported
	for (var i = 0, f; f = files[i]; i++) {
		if (!f.type.match('image.*')) {
			notify("Your file " + f.name + " doesn't seem to be an image or is corrupted.");
			continue;
		}
		
		var len = 0;
		for(x in current_files) len++;
		if(len >= 20){
			notify("There is a limit of 20 images at a time, so some of your images weren't added.");
			break;
		}

		var key;
		do {
			key = "img" + Math.random();
		} while (current_files.hasOwnProperty(key));
		current_files[key] = f;

		var size = 0;
		for (temp_file in current_files) {
			size += current_files[temp_file].size;
		}

		if (size > 8388608) {
			notify("An image was not added because it would bring the total size past 8MB. Remove some images and try again, or upload more images later.");
			delete current_files[key];
			break;
		}

		var reader = new FileReader();
		reader.onload = (function (theFile, theKey) {
			return function (e1) {
				$("form#image_upload p").text("Add More");
				var img = $("<img />").addClass("preview").attr("src", e1.target.result).css("display", "none");
				var div = $("<div><div class='del'>Remove</div><div class='info'></div><span class='helper'></span></div>").addClass("preview-container")
					.attr("id", theKey).append(img).css("display", "none").fadeIn();
				$("#preview-div").prepend(div);
				img.slideDown();
				div.find(".info").append("Name: " + getName(theFile.name) + "<br />"
					 + "Size: " + getSize(theFile.size)).attr("title", theFile.name + "\n" + theFile.size + " Bytes");
				div.find(".del").attr("title", "Remove this image from the upload queue").click(function () {
					div.animate({
						width : 0,
						height : 0,
						opacity : 0
					}, 700, function () {
						$(this).remove();
					});
					delete current_files[div.attr("id")];
					delete file_map[div.attr("id")];
				});
				$("#upload_button").fadeIn();
			};
		})(f, key);
		reader.onerror = function () {
			notify("Error: Unable to read your file " + f.name + ". Sorry!");
		};
		reader.readAsDataURL(f);
		
		var hashReader = new FileReader();
		hashReader.onload = (function(theFile, theKey) {
			return function(e2){
				file_map[theKey] = md5(e2.target.result);
			};
		})(f, key);
		hashReader.readAsBinaryString(f);
	}
});

$("#upload_button").click(function (e) {
	e.preventDefault();
	$("#results").slideUp();
	var len = 0;
	for(x in current_files) len++;
	if(len==0) return;
	$("#upload_progress").show();
	var formData = new FormData();
	formData.append("verify1", "");
	formData.append("verify2", "swag");
	formData.append("token", window.sessionToken);
	for(fileName in current_files){
		formData.append("userfile[]", current_files[fileName]);
	}
	$.ajax({
		url : "upload.php",
		type : 'POST',
		data: formData,
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
			$("#json_response").text(data);
			$("#upload_button").slideUp();
			try {
				var resp = JSON.parse(data);
				$("#results").html("").append("<p class='"+resp.status+"'><strong>Status: </strong>"+resp.status+"</p>")
					.slideDown();
				var numOk = 0, numFailed = 0;
				for(var i=0;i<resp.results.length;i++){
					if(resp.results[i].status == "success"){
						numOk++;
					} else {
						numFailed++;
					}
				}
				$("#results").append("<p class='"+(numOk > 0 ? 'success' : 'failed')+"'><strong>"+numOk+" </strong> images uploaded.</p>");
				if(numFailed > 0) {
					$("#results").append("<p class='error'><strong>"+numFailed+" </strong> images failed to upload.</p>");
					$("#upload_button").slideDown().find("p.text").text("Try again");
				}
			} catch(e){
				console.log(e);
				notify("Sorry! There was a problem receiving a response from our servers. Try again later.");
			}
		},
		error : function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown);
			$("#upload_progress").hide();
			$("#json_response").text("Sorry! Something bad happened and your image wasn't uploaded. Check your internet connection and try again.");
		},
		cache : false,
		contentType : false,
		dataType : "text",
		processData : false
	});
	return false;
});

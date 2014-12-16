$("form#image_upload").submit(function(e){
	e.preventDefault();
    var formData = new FormData($(this)[0]);
	$("#upload_progress").show();
    $.ajax({
        url: "upload.php",
        type: 'POST',
        data: formData,
        async: true,
		xhr: function(){
			var xhr = jQuery.ajaxSettings.xhr();
            if(xhr instanceof window.XMLHttpRequest) {
                xhr.upload.addEventListener("progress", function(evt){
					if (evt.lengthComputable) {  
						var percentComplete = evt.loaded * 100 / evt.total;
						console.log("Progress: ", percentComplete);
						$("#upload_progress").attr("max","100").attr("value",percentComplete);
					}
				}, false); 
            }
            return xhr;
		},
        success: function (data) {
            $("#upload_progress").hide();
			$("#json_response").text(JSON.stringify(data));
			$("[name=userfile]").val("");
        },
		error: function(){
			$("#upload_progress").hide();
			$("#json_response").text("Sorry! Something bad happened and your image wasn't uploaded. Check your internet connection and try again.");
		},
        cache: false,
        contentType: false,
        processData: false
    });
    return false;
});
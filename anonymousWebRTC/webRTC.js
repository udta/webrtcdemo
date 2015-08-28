(function($) {
	window.GSWebRTC = function() {
		var me = this;
		me.init();
	}

	GSWebRTC.prototype = {
		init: function() {
			var me = this;
			if ($("#anonymousWebRTC").length > 0) {
				// $("#anonymousWebRTC").css({
				// 	width: "500px",
				// 	height: "480px"
				// });
				$("#anonymousWebRTC").show();
				// 	// var mWindow = top.frames['frameDialog'];
				// 	// if (mWindow.sipRegister) {					
				// 	// 	mWindow.sipRegister();
				// 	// }
				return;
			}
			//CSS for anonymousWebRTC
			var anonymousWebRTCSS = '<style id="css-anonymousWebRTC" type="text/css">' +
				// '#rRightDown,#rLeftDown,#rLeftUp,#rRightUp,#rRight,#rLeft,#rUp,#rDown{ position: absolute;background: #C00;width: 7px;height: 7px;z-index: 5;font-size: 0;}' +
				// '#rLeftDown,#rRightUp{ cursor: ne-resize;}' +
				// '#rLeftDown,#rRightUp{ cursor: ne-resize;}' +
				// '#rRightDown,#rLeftUp{ cursor: nw-resize;}' +
				// '#rRight, #rLeft{ cursor: e-resize;}' +
				// '#rUp,#rDown{ cursor: n-resize;}' +
				// '#rRightUp{ right: -4px;top: -4px;}' +
				// '#rRightDown{right: -4px;bottom: -4px;background-color: #00F;}' +
				// '#rLeftUp{ left: -4px;top: -4px;}' +
				// '#rRight{ right: -4px; top: 50%; margin-top: -4px;}' +
				// '#rLeft{ left: -4px;top: 50%;margin-top: -4px;}' +
				// '#rUp{ top: -4px;left: 50%; margin-left: -4px;}' +
				// '#rDown{ bottom: -4px;left: 50%;margin-left: -4px;}' +
				'#anonymousWebRTC { display: none; z-index: 9999;}' +
				'#anonymousWebRTC .ul-style{ list-style: none; margin: 0; padding: 0; border: 0;font-size: 100%;font: inherit;vertical-align: baseline;box-sizing: border-box;height: 28px; cursor: pointer; cursor: hand;}' +
				'#anonymousWebRTC .ul-style li { float: right; height: 28px;}' +
				'#anonymousWebRTC .btn{ width: 28px; height: 28px; display: inline-block; margin: 0; padding: 0; outline：none; border: none; background: #2B2118; background-position: center; background-repeat: no-repeat; color: #fff; text-align: center; text-decoration: none; font-size: .9em; cursor: pointer;}' +
				'#anonymousWebRTC .btn.btn-narrow{ background-image: url("./anonymousWebRTC/webRTC/images/large.png");}' +
				'#anonymousWebRTC .btn.btn-narrow:hover{ background-image: url("./anonymousWebRTC/webRTC/images/large_hover.png");}' +
				'#anonymousWebRTC .btn.btn-narrow:focus{ background-image: url("./anonymousWebRTC/webRTC/images/large_pressed.png");}' +
				'#anonymousWebRTC .btn.btn-large{ background-image: url("./anonymousWebRTC/webRTC/images/large.png");}' +
				'#anonymousWebRTC .btn.btn-large:hover{ background-image: url("./anonymousWebRTC/webRTC/images/large_hover.png");}' +
				'#anonymousWebRTC .btn.btn-large:focus{ background-image: url("./anonymousWebRTC/webRTC/images/large_pressed.png");}' +
				'#anonymousWebRTC .btn.btn-maxsize{ background-image: url("./anonymousWebRTC/webRTC/images/maxsize.png");}' +
				'#anonymousWebRTC .btn.btn-maxsize:hover{ background-image: url("./anonymousWebRTC/webRTC/images/maxsize_hover.png");}' +
				'#anonymousWebRTC .btn.btn-maxsize:focus{ background-image: url("./anonymousWebRTC/webRTC/images/maxsize_pressed.png");}' +
				'#anonymousWebRTC .btn.btn-minisize{ background-image: url("./anonymousWebRTC/webRTC/images/minisize.png");}' +
				'#anonymousWebRTC .btn.btn-minisize:hover{ background-image: url("./anonymousWebRTC/webRTC/images/minisize_hover.png");}' +
				'#anonymousWebRTC .btn.btn-minisize:focus{ background-image: url("./anonymousWebRTC/webRTC/images/minisize_pressed.png");}' +
				'#anonymousWebRTC .btn.btn-close{background-image: url("./anonymousWebRTC/webRTC/images/close.png");}' +
				'#anonymousWebRTC .btn.btn-close:hover{background-image: url("./anonymousWebRTC/webRTC/images/close_hover.png");}' +
				'#anonymousWebRTC .btn.btn-close:focus{background-image: url("./anonymousWebRTC/webRTC/images/close_pressed.png");}' +
				'</style>';
			//CSS styles are only added once.
			if ($('#css-anonymousWebRTC').length <= 0) {

				// Pengcheng Zou Add.
				var head = $(document).find("head")
				$(anonymousWebRTCSS).appendTo(head);
			}
			me.render();
		},
		render: function() {
			var anonymousWebRTC = $("<div id='anonymousWebRTC'>").css({
				position: "fixed",
				bottom: "35px",
				right: 0,
				width: "500px",
				height: "480px",
				marginTop: "-104px"
			}).appendTo("body");
			// $("<div id='rRightDown'>").appendTo(anonymousWebRTC);
			// $("<div id='rLeftDown'>").appendTo(anonymousWebRTC);
			// $("<div id='rRightUp'>").appendTo(anonymousWebRTC);
			// $("<div id='rLeftUp'>").appendTo(anonymousWebRTC);
			// $("<div id='rRight'>").appendTo(anonymousWebRTC);
			// $("<div id='rLeft'>").appendTo(anonymousWebRTC);
			// $("<div id='rUp'>").appendTo(anonymousWebRTC);
			// $("<div id='rDown'>").appendTo(anonymousWebRTC);
			var title = $("<div>").css({
				background: "#181A1B",
				height: "28px"
			}).appendTo(anonymousWebRTC);

			var titleUl = $("<ul>").addClass("ul-style").appendTo(title);
			var closeLi = $("<li>").appendTo(titleUl);
			var minisizeLi = $("<li>").appendTo(titleUl);

			var minisizeBtn = $("<button>").addClass("btn btn-maxsize").appendTo(minisizeLi);
			var closeBtn = $("<button>").addClass("btn btn-close").appendTo(closeLi);
			var flag = true;

			$("<iframe>").attr({
				id: "frameDialog",
				name: "frameDialog",
				width: "100%",
				height: "100%",
				scrolling: "no",
				marginwidth: "0",
				marginheight: "0",
				frameborder: "0",
				src: "./anonymousWebRTC/webRTC.html"
			}).appendTo(anonymousWebRTC);

			closeBtn.click(function(event) {
				$("#anonymousWebRTC").hide();
			});
			minisizeBtn.click(function(event) {
				//$("#frameDialog").slideToggle(200);
				var mWindow = top.frames['frameDialog'];
				if (!flag) {
					flag = true;
					$("#anonymousWebRTC").css({
						width: "500px",
						height: "480px"
					});
					$("#callStatus", mWindow.document).css("top", "200px");
					$("#divVideoLocal", mWindow.document).removeClass("previewvideo-large");
					//$("#divVideo", mWindow.document).attr("height", "100%").removeAttr("width");
					minisizeBtn.addClass("btn-maxsize").removeClass("btn-minisize");
				} else {
					flag = false;
					$("#anonymousWebRTC").css({
						width: "100%",
						height: "96%"
					});
					$("#callStatus", mWindow.document).css("top", "300px");
					//$("#divVideo", mWindow.document).attr("width", "100%").removeAttr("height");
					minisizeBtn.addClass("btn-minisize").removeClass("btn-maxsize");
				}
			});

			// var rs = new Resize("anonymousWebRTC", {
			// 	Max: true,
			// 	mxContainer: "body"
			// });

			// rs.Set("rRightDown", "right-down");
			// rs.Set("rLeftDown", "left-down");

			// rs.Set("rRightUp", "right-up");
			// rs.Set("rLeftUp", "left-up");

			// rs.Set("rRight", "right");
			// rs.Set("rLeft", "left");

			// rs.Set("rUp", "up");
			// rs.Set("rDown", "down");


			// new Drag("anonymousWebRTC", {
			// 	Limit: true,
			// 	mxContainer: "body"
			// });
		}
	}
	new GSWebRTC();
})(jQuery)
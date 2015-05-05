$(document).ready(function() {
	var ua = detect.parse(navigator.userAgent);
	var path = $('.project_model').attr('path');
	console.log(ua);

	if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
	if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";

	console.log(ua.os);
	console.log(ua.browser.family);
	if (ua.browser.family == 'Chrome' && ua.isMobile == false && (OSName == 'MacOS' || OSName == 'Windows')) {
		console.log(OSName);
		$('.missing, .broken').remove();
		if (OSName == 'MacOS') {
			ext = '_mac.zip';
		}
		else if (OSName == 'Windows') {
			ext = '_pc.zip';
		}
		$('.broken_background').html('<a href='+path.substring(0, path.length - 8) + ext + '>К сожалению, мы пока не можем обеспечить корректное воспроизведение 3D на Вашем устройстве. Предлагаем вам скачать локальную версию модели.</a>')
	}
	else {
		function UnityLoader (path) {
			var config = {
				width: '100%',
				height: '100%',
				params: {
					enableDebugging: '0',
					disableContextMenu: true,
					logoimage: '/images/design/models/models_logo.png',
					progressbarimage: '/images/design/models/models_progress.png',
					progressframeimage: '/images/design/models/models_progress_frame.png'
				}
			};

			var u = new UnityObject2(config);

			var $missingScreen = $('#unityPlayer').find('.missing');
			var $brokenScreen = $('#unityPlayer').find('.broken');
			var $unsupportedScreen = $('#unityPlayer').find('.unsupported');

			$missingScreen.hide();
			$brokenScreen.hide();
			$unsupportedScreen.hide();

			u.observeProgress(function (progress) {
				switch(progress.pluginStatus) {
					case 'broken':
						$brokenScreen.find('a').click(function (e) {
							e.stopPropagation();
							e.preventDefault();
							u.installPlugin();
							return false;
						});
						$brokenScreen.show();
					break;
					case 'unsupported':
						$unsupportedScreen.show();
					break;
					case 'missing':
						$missingScreen.find('a').click(function (e) {
							e.stopPropagation();
							e.preventDefault();
							u.installPlugin();
							return false;
						});
						$missingScreen.show();
					break;
					case 'installed':
						$missingScreen.remove();
					break;
					case 'first':
					break;
				}
			});

			u.initPlugin($('#unityPlayer')[0], path);
		}
		UnityLoader(path);
	}
});
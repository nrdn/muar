$(document).ready(function() {
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

		$missingScreen.hide();
		$brokenScreen.hide();

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

	var path = $('.project_model').attr('path');
	UnityLoader(path);
});
let videoPlayer={
	instance : null,

};
videoPlayer.init = () =>{
	videoPlayer.instance = new Vue({
		el : '#player',
		data:{
			posterUrl:'',
			captionUrl:'',
			videoUrl:''
		},

		methods:{
			videoHTML(videoUrl, captionUrl, posterUrl) {
			    return '<video id="video-js" class="video-js vjs-default-skin" ' +
			        'controls preload="auto" width="800" height="600" ' +
			        'poster="' + posterUrl + '"' +
			        'data-setup=\'{"example_option":true}\'>' +
			        '\t<source src="' + videoUrl+ '" type="video/mp4" /> \n' +
			        '\t\t<track id="video-srt" kind="captions" src="' +captionUrl + '" srclang="it" label="Italian" default></track>\n ' +
			        '\t\t<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p>\n' +
			        '</video>';
			},
			setData(videoUrl,captionUrl,posterUrl){
				this.videoUrl = videoUrl;
				this.captionUrl = captionUrl;
				this.posterUrl = posterUrl;

				$('div.player_cnt').html(this.videoHTML(videoUrl,captionUrl,posterUrl));
    			player = videojs('#video-js');
			}
		}		
	});
};
$(document).ready(videoPlayer.init());
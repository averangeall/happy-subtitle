function addYoutube(videoId) {
    swfobject.embedSWF('http://www.youtube.com/v/' + videoId + '?enablejsapi=1&playerapiid=video&version=3',
                       'video', "550", "360", "8", null, null, 
                       {allowScriptAccess: "always"}, {id: 'video'});
}

function getVideoId(url) {
}

$('#youtube-submit').click(function() {
    var url = $.trim($('#youtube-url').val());
    if(url == '') {
        $('#youtube-msg').html('請輸入 Youtube 的網址!!');
        return;
    }
    var match1 = url.match(/.+youtube.com\/watch\?.*(v=([^&]+)).*/);
    var match2 = url.match(/youtu.be\/(.+)/);
    if(match1 == null && match2 == null) {
        $('#youtube-msg').html('網址好像怪怪的!!');
        return;
    }
    var videoId = '';
    if(match1 != null)
        videoId = match1[2];
    if(match2 != null)
        videoId = match2[1];

    $('#video').empty();
    $('#right').css('float', 'right')
               .css('margin-right', '30px');
    addYoutube(videoId);
});

//var video = document.getElementById('video');
//var time = video.getCurrentTime();

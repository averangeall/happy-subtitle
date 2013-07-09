var player;
var countId;
var lineIds = [];

function addYoutube(videoId) {
    swfobject.embedSWF('http://www.youtube.com/v/' + videoId + '?enablejsapi=1&playerapiid=video&version=3',
                       'video', "550", "360", "8", null, null, 
                       {allowScriptAccess: "always"}, {id: 'video'});
}

function startCount(timing) {
    countId = setInterval(function() {
        var second = parseInt(video.getCurrentTime());
        var date = new Date(second * 1000);
        var mm = ((date.getMinutes() < 10) ? '0' : '') + date.getMinutes();
        var ss = ((date.getSeconds() < 10) ? '0' : '') + date.getSeconds();
        timing.val(mm + ':' + ss);
    }, 100);
}

function enableCheck(check) {
    check.removeClass('btn-disabled').addClass('btn-info');
    check.click(function() {
        check.removeClass('btn-info').addClass('btn-success');
        clearInterval(countId);
        if(check.attr('id') == 'start-check') {
            startCount($('#end-timing'));
            enableCheck($('#end-check'));
        } else if(check.attr('id') == 'end-check') {
            video.pauseVideo();
        }
    });
}

function onYouTubePlayerReady(playerId) {
    player = $('#video');
    video.playVideo();
    startCount($('#start-timing'));
    enableCheck($('#start-check'));
}

function createLineId() {
    var lineId;
    while(true) {
        lineId = 'line-' + Math.floor(Math.random() * 100000);
        if($.inArray(lineId, lineIds) == -1)
            break;
    }
    lineIds.push(lineId);
    return lineId;
}

function addNewLine() {
    var line = $('<div/>').attr('id', createLineId())
                          .addClass('todo-content')
                          .append($('<h4/>').addClass('todo-name').html('一句台詞'))
                          .append($('<span>').html('00:00.0 - 00:00.0'));
    $('#lines-content').append($('<li/>').append(line));
}

function putAddNewLine() {
    var add = $('<div/>').addClass('todo-content')
                         .append($('<div/>').addClass('fui-plus'))
                         .append($('<h4/>').addClass('todo-name').html('新增一句'));
    add.click(addNewLine);
    $('#lines-add').append($('<li/>').addClass('todo-done').append(add));
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
    putAddNewLine();
});


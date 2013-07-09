var player;
var countId;
var curLineId;
var lines = [];

function addYoutube(videoId) {
    swfobject.embedSWF('http://www.youtube.com/v/' + videoId + '?enablejsapi=1&playerapiid=video&version=3',
                       'video', "550", "360", "8", null, null, 
                       {allowScriptAccess: "always"}, {id: 'video'});
}

function getYoutubeId(url) {
    var match1 = url.match(/.+youtube.com\/watch\?.*(v=([^&]+)).*/);
    var match2 = url.match(/youtu.be\/(.+)/);
    var videoId = null;
    if(match1 != null)
        videoId = match1[2];
    if(match2 != null)
        videoId = match2[1];
    return videoId;
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

function createLine() {
    var lineId;
    while(true) {
        lineId = Math.floor(Math.random() * 100000);
        if($.inArray(lineId, Object.keys(lines)) == -1)
            break;
    }
    var pos = Object.keys(lines).length;
    lines[lineId] = {
        words: '一句台詞',
        start: '00:00.0',
        end: '00:00.0',
        pos: pos,
        id: lineId,
    };
    return lineId;
}

function updateAllLines() {
    var sortedLines = [];
    for(var lineId in lines)
        sortedLines.push(lines[lineId]);
    sortedLines.sort(function(line1, line2) {
        if(line1.pos < line2.pos)
            return -1;
        if(line1.pos > line2.pos)
            return 1;
        return 0;
    });

    $('#lines-content').empty();
    $.each(sortedLines, function(idx, value) {
        var words = $('<h4/>').addClass('todo-name')
                              .html(value.words);
        if($.trim(value.words) == '')
            words.html($('<br/>'));
        var line = $('<div/>').attr('id', 'line-' + value.id)
                              .addClass('todo-content')
                              .append(words)
                              .append($('<span>').html(value.start + ' - ' + value.end));
        $('#lines-content').append($('<li/>').append(line));
    });
}

function showDetail() {
    $('#input-line').val(lines[curLineId].words);
}

function addNewLine() {
    curLineId = createLine();
    updateAllLines();
    showDetail();
}

function putAddNewLine() {
    var add = $('<div/>').addClass('todo-content')
                         .append($('<div/>').addClass('fui-plus'))
                         .append($('<h4/>').addClass('todo-name').html('新增一句'));
    add.click(addNewLine);
    $('#lines-add').append($('<li/>').addClass('todo-done').append(add));
}

function enableTiming() {
    $('#start-timing').removeAttr('disabled');
    $('#end-timing').removeAttr('disabled');
}

function enableInputLine() {
    $('#input-line').removeAttr('disabled')
                    .keyup(function(evt) {
                        lines[curLineId].words = $('#input-line').val();
                        updateAllLines();
                    });
}

function showVideo() {
    var url = $.trim($('#youtube-url').val());
    if(url == '') {
        $('#youtube-msg').html('請輸入 Youtube 的網址!!');
        return;
    }
    var videoId = getYoutubeId(url);
    if(videoId == null) {
        $('#youtube-msg').html('網址好像怪怪的!!');
        return;
    }

    $('#video').empty();
    $('#right').css('float', 'right')
               .css('margin-right', '30px');
    addYoutube(videoId);
}

function onYouTubePlayerReady(playerId) {
    player = $('#video');
    startCount($('#start-timing'));
    enableCheck($('#start-check'));
    enableTiming();
    putAddNewLine();
    addNewLine();
    enableInputLine();
    video.playVideo();
}

$('#youtube-submit').click(showVideo);
$('#youtube-url').focus();
$('#youtube-url').keyup(function(evt) {
    if(evt.which == 13)
        showVideo();
});


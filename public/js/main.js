import io from 'socket.io-client';
import { ajax, showStatus } from './utils.js';
import '../scss/main.scss';
var host = window.location.host;
if (window.location.host == 'localhost:5000') {
    host = 'http://' + window.location.host;
} else {
    host = 'https://photo-sharing-app-646.herokuapp.com'
}
var socket = io(host);

socket.on('status', function (data) {
    showStatus(data.msg, data.delay);
})

socket.on('doUpdate', function () {
    renderList();
})

function getImageSize(img, callback) {
    var $img = $(img);

    var wait = setInterval(function() {
        var w = $img[0].naturalWidth,
            h = $img[0].naturalHeight;
        if (w && h) {
            clearInterval(wait);
            callback.apply(this, [w, h]);
        }
    }, 30);
}

// render list of images on page load

const renderList = () => {
    $('.gallery .row').html('');
    ajax({
        url: host + '/getimages/',
        success: function (data) {
            var imageList = JSON.parse(data.response);
            for (let i = 0; i < imageList.length; i++) {
                var img = $('<img />').attr({
                    'src': 'https://s3.amazonaws.com/photobucket-646/' + imageList[i].filename
                });            
                var str = `<div class="col-md-4">
                    <div class="imageHolder">
                        <img src="https://s3.amazonaws.com/photobucket-646/` + imageList[i].filename + `" alt="">
                    </div>
                    <div class="overlay">
                        <div class="voteCtrl">
                            <button type="button" class="btn btn-light">
                                <a href="javascript:void(0)" data-photoid="` + imageList[i]._id + `" class="voteUp">
                                    <img src="../images/voteup.png" alt="Click Here to Vote Up !">
                                    <h4>` + imageList[i].votes + `</h4>
                                </a>
                            </button>
                        </div>
                        <div class="commentCtrl">
                        <button type="button" class="btn btn-light">
                            <a href="/comments/`+ imageList[i]._id + `" data-photoid="` + imageList[i]._id + `" class="voteUp">
                                <span class="glyphicon glyphicon-comment"></span>
                            </a>
                        </button>
                        </div>
                    </div>
                </div>`
                $('.col-md-4').find('.imageHolder').eq(i).append(img)
                $('.gallery .row').append(str);

                getImageSize(img, function(width, height) {
                    if(width/height > 1){
                        $('.col-md-4').eq(i).find('img').addClass('wide')
                    }else{
                        $('.col-md-4').eq(i).find('img').addClass('tall')
                    }
                    });

            }
        }
    });
}

renderList();

$(document).on('click', '#doUpload', function () {
    uploadNow();
})

function uploadNow() {
    $('.progress').fadeIn(100);
    var uploadURL = host + '/upload';
    var uploadFile = $('.uploadPic');
    if (uploadFile.val() != '') {
        var form = new FormData();
        form.append("upload", uploadFile[0].files[0]);
        // Perform the AJAX POST request and send the file
        ajax({
            method: 'post',
            url: uploadURL,
            success: function () {
                $('.progress').fadeOut(200);
                uploadFile.val('');
            },
            progress: function (e) {
                if (e.lengthComputable) {
                    var perc = Math.round((e.loaded * 100) / e.total);
                    $('.progress').css('width', (perc + '%'));
                }
            },
            payload: form
        })
    }
}


$(document).on('click', '.voteUp', function (e) {
    var that = $(this);
    ajax({
        url: host + '/voteup/' + that.data('photoid'),
        success: function (data) {
            var parseData = JSON.parse(data.response);
            that.find('h4').html(parseData.votes + 1);
        }
    });
});

$(function(){
    $(document).on('change', '.uploadPic', function(e){
        var ext = this.value.match(/\.([^\.]+)$/)[1].toLowerCase();
        var permit = ['jpg','gif','png'];
        if(permit.indexOf(ext)>-1){
            showStatus('Ready to Upload !', 600);
        } else {
            showStatus('Your Chosen File Is Not Permitted !! Please pick JPG, GIF or PNG files only !', 4000);
            $(this).val('');
        }
    })
})



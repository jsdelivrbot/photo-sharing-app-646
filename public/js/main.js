import io from 'socket.io-client';
import { ajax, showStatus } from './utils.js';
import '../scss/main.scss';
console.log('Hi There')
var host = window.location.host;
if (window.location.host == 'localhost:5000') {
    host = 'http://' + window.location.host;
} else {
    host = 'https://photo-sharing-app-646.herokuapp.com'
}
var socket = io(host);
console.log('socket = ', socket)

socket.on('status', function (data) {
    showStatus(data.msg, data.delay);
})

socket.on('doUpdate', function () {
    renderList();
})


// render list of images on page load

const renderList = () => {
    $('.gallery ul').html('');
    ajax({
        url: host + '/getimages/',
        success: function (data) {
            var imageList = JSON.parse(data.response);
            for (var i = 0; i < imageList.length; i++) {
                var str = '<li>';
                str += '<div class="overlay">';
                str += '<div class="voteCtrl">';
                str += '<a href="#" data-photoid="' + imageList[i]._id + '" class="voteUp">';
                str += '<img src="../images/voteup.png" alt="Click Here to Vote Up !">';
                str += '<h4>' + imageList[i].votes + '</h4>';
                str += '</a>';
                str += '</div>';
                str += '</div>';
                str += '<div class="imageHolder">';
                str += '<img src="https://s3.amazonaws.com/photobucket-646/' + imageList[i].filename + '" alt="">';
                str += '</div>';
                str += '</li>';

                $('.gallery ul').append(str);
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



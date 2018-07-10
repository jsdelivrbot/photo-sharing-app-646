
const showStatus = (msg,delay) => {
    $('.status').hide().html(msg).fadeIn(200).delay(delay).fadeOut(300);
}

const ajax = (config) =>{
    var method = config.method || 'GET';
    var payload = config.payload || null;
    var xhr = new XMLHttpRequest();
    xhr.open(method, config.url, true);
    xhr.upload.addEventListener("progress", function(e){
        config.progress(e);
    });
    xhr.addEventListener("load", function(){
        config.success(xhr);
    });
    xhr.addEventListener("error", config.error);
    xhr.send(payload);
}

const getImageSize = (img, callback) => {
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

const gethost = () =>{
    var host;
    if (window.location.host == 'localhost:5000') {
        host = 'https://' + window.location.host;
    } else {
        host = 'https://photo-sharing-app-646.herokuapp.com'
    }
    return host;
}

module.exports={
    showStatus,
    ajax,
    getImageSize,
    gethost
}
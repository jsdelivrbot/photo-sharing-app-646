import { ajax, showStatus } from './utils.js';

var host = window.location.host;
if (window.location.host == 'localhost:5000') {
    host = 'http://' + window.location.host;
} else {
    host = 'https://photo-sharing-app-646.herokuapp.com'
}

const initComments = (id) => {
    console.log('init comments now!!')
    renderComments(id)
    var $inputMessage = $('.inputMessage'); // Input message input box
    var $window = $(window);
    var username = 'ebn646@hotmail.com';
    var $messages = $('.messages');

    //
    $inputMessage.click((() =>{
        $inputMessage.focus();
    }))

    //
    // When client hits ENTER on their keyboard
    $window .keydown(event => {
        // When client hist ENTER on their keyboard
        if(event.which == 13){
            //send message
            sendMessage();
        }
    
    })

  
    // Sends a chat message
    const sendMessage = () =>{
        var message = $inputMessage.val();
        addChatMessage(({
            username: username,
            message: message
        }))
    }

    // Adds the visual chat message to the message list
    const addChatMessage = (data,options) =>{
        console.log('data = ',data);

        var $usernameDiv = $('<span class="username"/>')
        .text(data.username)

        var $messageBodyDiv = $('<span class="messageBody">')
        .text(data.message)

        var $messageDiv = $('<li class="message"/>')
        .data('username', data.username)
        .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options)
    }
}

// Adds the message element to the messages
const addMessageElement = (el, options) => {
    var $el = $(el);
    var $messages = $('.messages');

    $messages.append($el);
}

const renderComments = (id) => {
    ajax({
        url: host + '/getcomments/' + id,
        success: function (data) {

            renderImage(data)
        }
    })
}

const renderImage = (data) => {
    var imageData = JSON.parse(data.response);

    var comments;
    if(imageData.comments == undefined){
        comments = 0;
    }else{
        comments = imageData.comments;
    }

    var str = `<div class="col-md-6 photocard">
    <div class="photocard__imageHolder">
        <img src="https://s3.amazonaws.com/photobucket-646/`+imageData.filename+`"/>
    </div>
    <div class="photocard__overlay">
        <div class="photocard__voteCtrl">
            <button type="button" class="btn btn-light button__flex">
                <a href="javascript:void(0)" data-photoid="` + imageData._id + `" class="voteUp">
                    <img src="../images/voteup.png" alt="Click Here to Vote Up !">
                    <h6>` + imageData.votes + `</h6>
                </a>
            </button>
        </div>
        <div class="photocard__commentCtrl">
        <button type="button" class="btn btn-light button__flex">
            <a href="/comments/`+ imageData._id + `" data-photoid="` + imageData._id + `">
                <i class="fas fa-comments"></i>
                <h6>` + comments + `</h6>
            </a>
        </button>
        </div>
    </div>
</div>`
$('.comments .row').prepend(str);
}

module.exports = {
    initComments,
    renderComments
}
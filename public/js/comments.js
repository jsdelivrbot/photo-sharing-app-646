import { ajax } from './utils.js';
$(function () {
    var $inputMessage = $('.inputMessage'); // Input message input box
    var $window = $(window);
    var username = 'ebn646@hotmail.com';
    var $messages = $('.messages');
    var pathArray = window.location.pathname.split('/');
    var host;

    if (window.location.host == 'localhost:5000') {
        host = 'http://' + window.location.host;
    } else {
        host = 'https://photo-sharing-app-646.herokuapp.com'
    }

    const renderComments = (id) => {
        ajax({
            url: host + '/getcomments/' + id,
            success: function (data) {
                renderImage(data)
            }
        })
    }


    switch (pathArray[1]) {
        case 'comments':
            renderComments(pathArray[2]);
            break;
    }

    $inputMessage.click((() => {
        $inputMessage.focus();
    }))

    const renderImage = (data) => {
        var imageData = JSON.parse(data.response);

        var comments;
        if (imageData.comments == undefined) {
            comments = 0;
        } else {
            comments = imageData.comments;
        }

        var str = `<div class="col-md-6 photocard">
    <div class="photocard__imageHolder">
        <img src="https://s3.amazonaws.com/photobucket-646/`+ imageData.filename + `"/>
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


    // When client hits ENTER on their keyboard
    $window.keydown(event => {
        // When client hist ENTER on their keyboard
        if (event.which == 13) {
            //send message
            sendMessage();
        }

    })

    // Sends a chat message
    const sendMessage = () => {
        var message = $inputMessage.val();
        addChatMessage(({
            username: username,
            message: message
        }))
    }


    // Adds the visual chat message to the message list
    const addChatMessage = (data, options) => {
        console.log('data = ', data);

        var $usernameDiv = $('<span class="username"/>')
            .text(data.username)

        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message)

        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options)
    }

    // Adds the message element to the messages
    const addMessageElement = (el, options) => {
        var $el = $(el);
        $messages.append($el);

        incrementComments(pathArray[2])
    }

    const incrementComments = (id) => {
        ajax({
            url: host + '/commentup/' + id,
            success: function(results){
                var comments = JSON.parse(results.response);
                console.log('results = ',comments)
            }
        })

    }
});

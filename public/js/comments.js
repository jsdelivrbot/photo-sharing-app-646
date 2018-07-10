import { ajax, getImageSize, gethost } from './utils.js';

const init = (host, socket) => {
    var $inputMessage = $('.inputMessage'); // Input message input box
    var $window = $(window);
    var username = 'ebn646@gmail.com';
    var $messages = $('.messages');
    var pathArray = window.location.pathname.split('/');
    var host = gethost();
    var connected = false;

    // Whenever the server emits 'new increment number', update the comment count.
    socket.on('new increment number', (data) => {
        console.log('new increment message received on the client ', data.comments)
        incrementComments(data.comments)
    });

    const renderComments = (id) => {
        ajax({
            url: host + '/getcomments/' + id,
            success: function (data) {
                var pageData = JSON.parse(data.response);
                console.log('Data received on the front end ', pageData);
                renderImage(pageData);
                renderCommentsList(pageData);
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
    }));

    const renderImage = (data) => {
        var imageData = data;

        var comments;
        if (imageData.comments == undefined) {
            comments = 0;
        } else {
            comments = imageData.comments;
        }

        var img = $('<img />').attr({
            'src': 'https://s3.amazonaws.com/photobucket-646/' + imageData.filename
        });

        var str = `<div class="photocard__imageHolder">
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
                    <a href="javascript:void(0)" data-photoid="` + imageData._id + `">
                        <i class="fas fa-comments"></i>
                        <h6 class="commentcount">` + comments + `</h6>
                    </a>
                </button>
                </div>
            </div>`
        $('.comments .row .photocard').append(str);

        $('.comments .row .photocard').find('.photocard__imageHolder').append(img)

        getImageSize(img, function (width, height) {
            if (width / height > 1) {
                $('.comments .row .photocard').find('img').addClass('wide')
            } else {
                $('.comments .row').find('.photocard').find('img').addClass('tall')
            }
        });
    }

    const renderCommentsList = (data) => {
        var commentList = data.messages;
        for (let i = 0; i < commentList.length; i++) {
            var li = `<li class="message">
            <span class="username">`+ username + `</span>
            <span class="messageBody">`+ commentList[i].message + `</span>
            </li>`
            $messages.append(li);
        }
    }


    // When client hits ENTER on their keyboard

    $window.keydown(event => {
        // When client hist ENTER on their keyboard
        if (event.which == 13) {
            //send message
            sendMessage();
        }
    });

    // Prevents input from having injected markup
    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    }

    // Sends a chat message
    const sendMessage = () => {
        var message = $inputMessage.val();
        // Prevent markup from being injected into the message
        message = cleanInput(message);
        // If there is a non-empty message and a socket connection
        if (message && connected) {
            // Clear input
            $inputMessage.val('');
            addChatMessage({
                username: username,
                message: message
            });
            // Tell server to execute 'new message' and send along one parameter
            socket.emit('new message', message,pathArray[2]);
        }
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
    }

    const incrementComments = (num) => {
        $('.commentcount').text(num)
    }
};

module.exports = {
    init
}

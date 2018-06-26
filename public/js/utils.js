
const showStatus = (msg,delay) => {
    $('.status').hide().html(msg).fadeIn(200).delay(delay).fadeOut(300);
}

module.exports={
    showStatus
}
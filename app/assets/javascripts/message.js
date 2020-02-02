$(function(){
  var reloadMessages = function() {
    last_message_id = $('.chat-main__message-list--message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.chat-main__message-list').append(insertHTML);
        $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert("error");
    });
  };

  function buildHTML(message){
    if ( message.image ) {
      var html =
        `<div class="chat-main__message-list--message" data-message-id=${message.id}>
          <div class="chat-main__message-list--upper-info">
            <div class="chat-main__message-list--talker">
              ${message.user_name}
            </div>
            <div class="chat-main__message-list--date">
              ${message.created_at}
            </div>
          </div>
          <p class="chat-main__message-list--message-text">
            ${message.content}
          </p>
          <img class="chat-main__message-list--message-image" src=${message.image}>
        </div>`
      return html;
    } else {
      var html =
        `<div class="chat-main__message-list--message" data-message-id=${message.id}>
          <div class="chat-main__message-list--upper-info">
            <div class="chat-main__message-list--talker">
              ${message.user_name}
            </div>
            <div class="chat-main__message-list--date">
              ${message.created_at}
            </div>
          </div>
          <p class="chat-main__message-list--message-text">
            ${message.content}
          </p>
        </div>`
      return html;
    };
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main__message-list').append(html);
      $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      $('form')[0].reset();
    })
    .fail(function(){
      alert("メッセージ送信に失敗しました");
    })
    .always(function(){
      $('.chat-main__message-form--submit-btn').prop('disabled', false);
    });
  });
  
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});
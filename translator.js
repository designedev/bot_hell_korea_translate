var telegram = require('telegram-bot-api');

var work_count = 0;
const MAX_WORK_COUNT = 10;

var api = new telegram({
	token: '339586510:AAE308_vVuUij2KDDOys-f02VHeRxwUUdwY',
	updates: {enabled: true}
});

/*
TELEGRAM MESSAGE DATA FORMAT...

{ message_id: 29,
  from: 
   { id: 58034127,
     first_name: 'Torrent',
     last_name: 'of Rivia',
     username: 'torrent' },
  chat: 
   { id: 58034127,
     first_name: 'Torrent',
     last_name: 'of Rivia',
     username: 'torrent',
     type: 'private' },
  date: 1491117892,
  text: '312' }
*/

api.on('message', function(message) {
	console.log("bot load : " + work_count + "/" + MAX_WORK_COUNT);
	if(message.text == '헬로비너스') {
		send_photo(message.chat.id);
	}
	else if (check_quota(message)) {
		translate(message);
		reduce_quota();
	}
});

function check_quota(message) {
	if(work_count >= MAX_WORK_COUNT) {
		send_msg(message.chat.id, "너무 많은 사용자들이 사용하고 있습니다. \n조금 뒤에 시도해주세요.");
		send_msg_to_master("사용자가 너무 많습니다. 대박");
		return false;
	}
	else {
		work_count++;
		console.log(`work count increased ( ${work_count} )`);
		return true;
	}
}

function reduce_quota() {
	work_count --;
	if(work_count <= 0) work_count == 0;
	console.log(`work count decreased ( ${work_count} )`);
}


function send_msg(chat_id, msg) {
	api.sendMessage({
		chat_id: chat_id,
		text: msg
	}).then(function(msg) {
		// console.log(msg);
	}, function(error) {
		// console.log(error);
	});
}

function send_msg_to_master(msg) {
	send_msg(master_user_id, msg);
}

function send_photo(chat_id) {
	api.sendPhoto({
    	chat_id: chat_id,
    	caption: '김순철이 좋아하는 헬로비너스입니다.',
    	photo: './pic/hell_o.jpg'
	}).then(function(data) {

	});
}


function translate(message) {
	if (message && message.text.startsWith('헬 ')) {
		var wordArr = message.text.split(' ');
		var translated_text = '';
		var skipNext = false;
		wordArr.forEach(function(word, index) {
			if(skipNext) {
				skipNext = false;
			}
			else {
				switch(word) {
				case '친애하는':
					translated_text += "내게 고용된 ";
					break;
				case '여러분':
					if(word.length > index + 1 && word[index + 1] == '각자가') {
						skipNext = true;
						translated_text += "월급 별레들이 "
					}
					else {
						translated_text += word + ' ';	
					}
				default:
					translated_text += word + ' ';
				}
			}
		});
		send_msg(message.chat.id, translated_text);
	}
}

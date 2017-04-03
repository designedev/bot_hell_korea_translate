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
	if(message.text) {
		console.log(`user : ${message.from.first_name} ${message.from.last_name} (${message.from.username}) : ${message.text} [${work_count}/${MAX_WORK_COUNT}]`);
		if(message.text == '헬로비너스') {
		send_photo(message.chat.id);
		}
		else if (message.text == '헬 도움') {
			var help_text = `
			== 헬조선 직장인말 번역기입니다. ==
			사용법은 아래와 같습니다.
			"헬 할말 쭉 쓰세요"
			아래는 번역되는 문구들입니다.

			친애하는 = 내게 고용된
			가족 여러분 = 월급 벌레들아
			우리는 = 내 회사는
			급변하는 = 지랄맞은
			경제위기 = 내 호주머니 사정
			여러분 각자가 = 월급 벌레들이
			이 회사의 = 내 회사에
			주인공 = 노비
			변화와 = 괜히 일 만들지말고 하던거나
			혁신 = 잘해라
			역동적으로 = 주말에 등산
			열정적으로 = 회식은 기본이 3차
			긍정적인 = 지각하지 말고
			자세로 = 지켜보고 있으니
			내일까지 = 오늘 밤 새서 
			간단하니까 = 니가 해야겠어
			쉽잖아 = 내일아침까지 내 책상 위에
			새로운 기획안 = 기안자는 내 이름으로
			몸이 안좋네 = 홍삼같은거 한첩 다려와
			오늘 뭐해 = 이따 술
			주말에 뭐해 = 나랑 놀아줘
			사람이 됐어 = 넌 내 비위를 잘 맞춰
			자네 = 임마
			다시 봤어 = 인사고과는 0이야 
			`;
			send_msg(message.chat.id,help_text);
		}
		else if (check_quota(message)) {
			build(message);
			reduce_quota();
		}
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
		//console.log(`work count increased ( ${work_count} )`);
		return true;
	}
}

function reduce_quota() {
	work_count --;
	if(work_count <= 0) work_count == 0;
	//console.log(`work count decreased ( ${work_count} )`);
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


function build(message) {
	if (message.text && message.text.startsWith('헬 ')) {
		var wordArr = message.text.split(' ');
		var translated_text = '';
		var skipNext = false;
		wordArr.forEach(function(word, index) {
			if(index == 0 || skipNext) {
				skipNext = false;
			}
			else {
				switch(word) {
				case '친애하는':
					translated_text += "내게 고용된 ";
					break;
				case '우리는':
					translated_text += "내 회사는 ";
					break;
				case '급변하는':
					translated_text += "지랄맞은 ";
					break;	
				case '경제위기':
					translated_text += "내 호주머니 사정 ";
					break;	
				case '주인공':
					translated_text += "노비 ";
					break;	
				case '변화와':
					translated_text += "괜히 일 만들지말고 하던거나 ";
					break;	
				case '혁신':
					translated_text += "잘해라 ";
					break;	
				case '역동적으로':
					translated_text += "주말에 등산 ";
					break;	
				case '열정적으로':
					translated_text += "회식은 기본이 3차 ";
					break;	
				case '긍정적인':
					translated_text += "지각하지 말고 ";
					break;	
				case '자세로':
					translated_text += "지켜보고 있으니 ";
					break;						
				case '내일까지':
					translated_text += "오늘 밤 새서 ";
					break;	
				case '간단하니까':
					translated_text += "니가 해야겠어 ";
					break;	
				case '쉽잖아':
					translated_text += "내일까지 내 책상 위에 ";
					break;	
				case '자네':
					translated_text += "야임마 ";
					break;																																																														
				case '가족':
					if(wordArr.length > index + 1 && wordArr[index + 1] == '여러분') {
						skipNext = true;
						translated_text += "월급 별레들이 "
					}
					else {
						translated_text += word + ' ';	
					}
					break;
				case '여러분':
					if(wordArr.length > index + 1 && wordArr[index + 1] == '각자가') {
						skipNext = true;
						translated_text += "월급 별레들이 "
					}
					else {
						translated_text += word + ' ';	
					}
					break;
				case '새로운':
					if(wordArr.length > index + 1 && wordArr[index + 1] == '기획안') {
						skipNext = true;
						translated_text += "기안자는 내 이름으로 "
					}
					else {
						translated_text += word + ' ';	
					}
					break;
				case '몸이':
					if(wordArr.length > index + 1 && wordArr[index + 1] == '안좋네') {
						skipNext = true;
						translated_text += "홍삼같은거 한첩 다려와 "
					}
					else {
						translated_text += word + ' ';	
					}
					break;
				case '오늘':
					if(wordArr.length > index + 1 && wordArr[index + 1] == '뭐해') {
						skipNext = true;
						translated_text += "이따 술 "
					}
					else {
						translated_text += word + ' ';	
					}
					break;
				case '주말에':
					if(wordArr.length > index + 1 && wordArr[index + 1] == '뭐해') {
						skipNext = true;
						translated_text += "나랑 놀아줘 "
					}
					else {
						translated_text += word + ' ';	
					}
					break;								
				case '사람이':
					if(wordArr.length > index + 1 && wordArr[index + 1] == '됐어') {
						skipNext = true;
						translated_text += "넌 내 비위를 잘 맞춰 "
					}
					else {
						translated_text += word + ' ';	
					}
					break;								
				case '다시':
					if(wordArr.length > index + 1 && wordArr[index + 1] == '봤어') {
						skipNext = true;
						translated_text += "인사고과는 0이야 "
					}
					else {
						translated_text += word + ' ';	
					}
					break;																					
				default:
					translated_text += word + ' ';
				}
			}
		});
		send_msg(message.chat.id, translated_text);
	}
}

// 1단계에서 생성한 API Gateway의 엔드포인트 주소를 여기에 붙여넣으세요!
const API_ENDPOINT = 'https://ptmw9uzbd0.execute-api.us-east-1.amazonaws.com/default/BedrockChatbotFunction'; 

// HTML 요소들을 가져옵니다.
const chatHistory = document.getElementById('chat-history');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const loadingIndicator = document.getElementById('loading-indicator');

// 전송 버튼 클릭 시 sendMessage 함수 호출
sendButton.addEventListener('click', sendMessage);

// 엔터 키를 눌렀을 때도 sendMessage 함수 호출
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// 화면에 메시지를 표시하는 함수
function displayMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);

    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    
    messageDiv.appendChild(paragraph);
    chatHistory.appendChild(messageDiv);
    
    // 스크롤을 항상 맨 아래로 이동
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// 메시지를 백엔드로 보내고 응답을 받는 메인 함수
async function sendMessage() {
    const userMessage = messageInput.value.trim();
    if (userMessage === '') {
        return; // 입력 내용이 없으면 아무것도 하지 않음
    }

    // 1. 화면에 사용자 메시지 표시
    displayMessage(userMessage, 'user');
    messageInput.value = ''; // 입력창 비우기

    // 2. 로딩 시작
    loadingIndicator.classList.remove('hidden');
    sendButton.disabled = true;

    try {
        // 3. API Gateway로 요청 전송 (fetch API 사용)
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage 
            })
        });

        if (!response.ok) {
            throw new Error('네트워크 응답에 문제가 있습니다.');
        }

        const data = await response.json();
        
        // 4. 화면에 봇 응답 메시지 표시
        displayMessage(data.response, 'bot');

    } catch (error) {
        console.error('Error:', error);
        displayMessage('죄송합니다. 오류가 발생했어요. 잠시 후 다시 시도해주세요.', 'bot');
    } finally {
        // 5. 로딩 종료
        loadingIndicator.classList.add('hidden');
        sendButton.disabled = false;
        messageInput.focus(); // 다시 입력창에 포커스
    }
}
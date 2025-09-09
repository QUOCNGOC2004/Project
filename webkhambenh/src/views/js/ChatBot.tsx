import React, { useState, useRef, useEffect } from 'react';
import '../css/ChatBot.css';

const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=';
const apiKey = 'AIzaSyDeJ7d8GsTTt3u2NHXn7VCLCwa6W-DcVz4'; 

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { text: 'Chào mừng bạn đến với trang web đặt lịch khám bệnh. Tôi có thể giúp gì cho bạn?', isUser: false },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const appendMessage = (text: string, isUser: boolean) => {
    setMessages((prevMessages) => [...prevMessages, { text, isUser }]);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = userInput.trim();
    if (!prompt || isLoading) return;

    appendMessage(prompt, true);
    setUserInput('');
    setIsLoading(true);

    const systemPrompt =
      'Bạn là một AI chatbot tư vấn và hỗ trợ khách hàng của trang web đặt lịch khám bệnh trực tuyến. Trang web có 4 chức năng chính: Thanh toán, Đặt lịch khám, Tìm bác sĩ và Quản lý lịch khám. Nhiệm vụ của bạn là: 1.  Hỗ trợ dịch vụ: Luôn hướng người dùng đến các chức năng chính của trang web. Ví dụ: khi người dùng hỏi về triệu chứng, hãy khuyến khích họ đặt lịch khám với bác sĩ chuyên khoa phù hợp. Khi người dùng hỏi về bác sĩ, hãy hướng họ sử dụng chức năng Tìm bác sĩ. 2.  Từ chối khéo léo: Không trả lời các câu hỏi không liên quan đến dịch vụ y tế, khám bệnh hoặc các chức năng của trang web. Nếu người dùng hỏi một câu không liên quan, hãy từ chối một cách lịch sự như: Tôi xin lỗi, tôi chỉ có thể hỗ trợ các thông tin về dịch vụ y tế và các chức năng của trang web chúng tôi. Bạn có muốn tìm hiểu về bác sĩ hay đặt lịch khám không?. 3.  Tập trung vào khách hàng: Ngay cả khi người dùng nói tôi không muốn đăng kí ở cơ sở của bạn, hãy phản hồi một cách chuyên nghiệp và tiếp tục giới thiệu dịch vụ. Tránh các câu trả lời chung chung như đó là lựa chọn của bạn. Ví dụ: bạn có thể nói Tôi hiểu, nhưng chúng tôi có nhiều bác sĩ chuyên khoa giỏi và các gói dịch vụ đa dạng. Nếu bạn có bất kỳ thắc mắc nào về sức khỏe, chúng tôi vẫn sẵn lòng tư vấn sơ bộ và giúp bạn tìm một bác sĩ phù hợp. 4.  Ngắn gọn và hữu ích: Trả lời trực tiếp, rõ ràng và thân thiện. Không đưa ra lời khuyên y tế chính thức hoặc thay thế chẩn đoán của bác sĩ. Luôn khuyến khích người dùng đến cơ sở y tế. 5.  Chào hỏi: Khi người dùng mới vào trang, hãy chào hỏi và hỏi họ cần giúp gì, đồng thời giới thiệu ngắn gọn các dịch vụ chính.';

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
    };

    try {
      const response = await fetch(API_URL + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        appendMessage(text, false);
      } else {
        appendMessage('Xin lỗi, tôi không thể trả lời câu hỏi này. Vui lòng thử lại sau.', false);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API Gemini:', error);
      appendMessage('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.', false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-box">
        <div className="chatbot-header">
          <h1>Chatbot Tư Vấn</h1>
          <p>Hãy hỏi về các dịch vụ hoặc tình trạng sức khỏe của bạn.</p>
        </div>

        <div ref={chatWindowRef} className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.isUser ? 'user' : 'bot'}`}
            >
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="chat-loading">
              <span>.</span><span>.</span><span>.</span>
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <form onSubmit={sendMessage} className="chat-form">
            <input
              type="text"
              id="user-input"
              placeholder="Nhập tin nhắn của bạn..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              required
            />
            <button type="submit" id="send-button" disabled={isLoading}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="send-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

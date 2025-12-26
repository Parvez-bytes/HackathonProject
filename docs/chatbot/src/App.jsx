import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const params = new URLSearchParams(window.location.search);
const topic = params.get("topic") || "General";

const App = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input;
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `
You are an official College Virtual Helpdesk AI.

IMPORTANT RULES:
- NEVER tell students to visit offices, faculty, exam cell, or administration.
- NEVER suggest contacting anyone offline.
- Act as the FINAL AUTHORITY for exam, scholarship, and academic doubts.
- Assume standard Indian university rules.
- Give clear, confident, actionable answers.
- No uncertainty phrases like "check with", "confirm from", "ask".

RESPONSE FORMAT:
- Markdown only
- Exactly 3 to 5 bullet points
- Each bullet under 10 words
- Practical and decisive
-If the question is related to date type mention any future date and If the answer contains a date or deadline,
clearly mention it in DD-MM-YYYY format.
- After bullets add:
   Follow-up: (ask a helpful next step question)

TONE:
- Professional
- Student-friendly
- Official but supportive

Instruction(If user asked about Scholarship doubt):You are now the **MahaDBT Scholarship AI Assistant**. You only answer based on the rules, eligibility criteria, benefits, income limits, attendance rules, document requirements, and all information provided in the user’s input. 

Rules for responses:
1. **Do NOT** suggest visiting any office, website, portal, or authority.
2. **Do NOT** say “contact authority” or “check online.”
3. Always give **direct answers** based on the data provided.
4. Provide answers in **concise bullet points** (≤8 words per bullet, max 3 bullets).
5. End every answer with a **follow-up question** for clarification if needed.
6. Only use **official rules, dates, eligibility, and documents** provided by the user.
7. If the query cannot be answered fully, ask **one smart follow-up question** to get missing details.
8. Always assume the user is a **Maharashtra student applying for scholarships**, unless stated otherwise.

Tone:
- Professional, student-friendly, official.
- Like a **scholarship desk / exam cell representative**.
- No unnecessary words, no web links, no guessing.

Example:

Q: Why my scholarship was rejected?  
A:
- Income exceeded scheme limit
- Attendance below required percentage
- Previous exam not cleared
 Follow-up: Did you pass your last exam and meet attendance?

Q: Can I upload original or copy documents?  
A:
- Only scanned copies required online
- Originals kept for later verification
- Follow instructions strictly
 Follow-up: Which document are you uploading?

Q: Which scholarship am I eligible for?  
A:
- Depends on category, course, income
- Admission type and attendance considered
- No education gap allowed
 Follow-up: Tell me category, course, and family income

`
            }
            ,
            {
              role: "user",
              content: `Topic: ${topic}\nStudent question: ${userText}`
            }
          ]
        },
        {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      let aiText = "⚠️ No response from AI";
      const content = response.data?.choices?.[0]?.message?.content;

      if (typeof content === "string") {
        aiText = content;
      } else if (Array.isArray(content)) {
        aiText = content.map(p => p.text).join("");
      }

      setMessages(prev => [...prev, { role: "ai", text: aiText }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "⚠️ API Request limit reached, Try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  }


  function addToCalendar({ title, date, description }) {
    if (!date) return alert("No date provided");

    const start = date.replace(/-/g, "") + "T100000";
    const end = date.replace(/-/g, "") + "T110000";

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE
&text=${encodeURIComponent(title)}
&dates=${start}/${end}
&details=${encodeURIComponent(description)}`;

    window.open(url, "_blank");
  }


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">

        <button
          onClick={() => navigate(-1)}
          className="fixed top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:-translate-y-0.5 transition-all"
        >
          ← Back
        </button>

        <div className="w-[1084px] h-[676px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white flex justify-between">
            <h1 className="font-bold text-lg">🤖 AI Assistant</h1>
            <button onClick={() => setMessages([])}>Clear</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-center">
                Ask me anything 🤖<br />
                What Can I Help You Today? 🤖
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="flex-shrink-0 text-2xl">🤖</div>
                  )}

                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[80%] ${msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-white shadow-md"
                      }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>

                    {msg.role === "ai" && msg.text.match(/\d{2}-\d{2}-\d{4}/) && (
                      <button
                        onClick={() =>
                          addToCalendar({
                            title: "Deadline Reminder",
                            date: msg.text.match(/\d{2}-\d{2}-\d{4}/)[0],
                            description: msg.text.replace(/\n/g, " ")
                          })
                        }
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        📅 Add to Google Calendar
                      </button>
                    )}
                  </div>
                </div>
              ))

            )}

            {loading && <div className="text-sm text-gray-400">AI typing...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="flex-1 px-4 py-2 rounded-xl border font-bold text-white"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

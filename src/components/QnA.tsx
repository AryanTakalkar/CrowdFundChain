import React, { useState, useEffect } from "react";

const QnA = ({ campaignId }: { campaignId: string }) => {
    const [questions, setQuestions] = useState<{ question: string; answer?: string }[]>([]);
    const [newQuestion, setNewQuestion] = useState("");

    // Load stored questions when component mounts
    useEffect(() => {
        const storedQuestions = JSON.parse(localStorage.getItem(`qna-${campaignId}`) || "[]");
        setQuestions(storedQuestions);
    }, [campaignId]);

    // Handle adding a new question
    const handleAskQuestion = () => {
        if (!newQuestion.trim()) return;
        const updatedQuestions = [...questions, { question: newQuestion }];
        setQuestions(updatedQuestions);
        localStorage.setItem(`qna-${campaignId}`, JSON.stringify(updatedQuestions));
        setNewQuestion("");
    };

    // Handle answering a question (Only campaign creators)
    const handleAnswer = (index: number, answer: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answer = answer;
        setQuestions(updatedQuestions);
        localStorage.setItem(`qna-${campaignId}`, JSON.stringify(updatedQuestions));
    };

    return (
        <div className="mt-10 p-4 border rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Backer Q&A</h3>

            {/* Input field for new questions */}
            <div className="mb-4">
                <textarea
                    className="w-full p-2 border rounded dark:text-black dark:bg-gray-400"
                    placeholder="Ask a question about this campaign..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                ></textarea>
                <button 
                    className="mt-2 px-4 py-2 bg-primary text-white rounded"
                    onClick={handleAskQuestion}
                >
                    Ask Question
                </button>
            </div>

            {/* Display asked questions */}
            <div>
                {questions.length > 0 ? (
                    questions.map((qna, index) => (
                        <div key={index} className="border-b py-2">
                            <p className="font-semibold">Q: {qna.question}</p>
                            {qna.answer ? (
                                <p className="text-green-600">A: {qna.answer}</p>
                            ) : (
                                <p className="text-gray-500">Awaiting response...</p>
                            )}

                            {/* Input field for campaign creator to answer */}
                            {!qna.answer && (
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded mt-2"
                                    placeholder="Answer this question..."
                                    onBlur={(e) => handleAnswer(index, e.target.value)}
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No questions yet. Be the first to ask!</p>
                )}
            </div>
        </div>
    );
};

export default QnA;

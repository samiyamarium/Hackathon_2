// frontend/src/app/chatService.ts

export interface ChatResponse {
  conversation_id: number;
  response: string;
}

export async function sendMessage(
  userId: string,
  message: string,
  conversationId: number | undefined,
  token: string
): Promise<ChatResponse> {
  
  const payload = {
    conversation_id: conversationId,
    message: message,
  };

  const response = await fetch(`/api/${userId}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Pass the auth token
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to send message to backend");
  }

  return response.json();
}

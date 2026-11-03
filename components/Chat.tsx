'use client';

import { useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

interface ChatProps {
  roomId: string;
  userId: string;
  username: string;
}

export default function Chat({ roomId, userId, username }: ChatProps) {
  const messagesRef = useRef<ChatMessage[]>([]);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Mock implementation — real Ably setup needed
    // For now: log-based approach (upgrade when DB ready)
    console.log(`Chat ready: room=${roomId}, user=${userId}`);

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [roomId, userId]);

  function handleSendMessage(content: string) {
    const message: ChatMessage = {
      id: `${Date.now()}`,
      userId,
      username,
      content,
      timestamp: new Date(),
    };
    messagesRef.current.push(message);
    console.log('Message sent:', message);
  }

  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12 }}>
      <h4>Chat</h4>
      <div style={{ height: 300, overflowY: 'auto', marginBottom: 12, border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 8 }}>
        {messagesRef.current.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 8, fontSize: 12 }}>
            <strong>{msg.username}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const input = (e.target as HTMLFormElement).elements.namedItem('message') as HTMLInputElement;
          handleSendMessage(input.value);
          input.value = '';
        }}
      >
        <input
          name="message"
          placeholder="Tulis pesan..."
          style={{ width: 'calc(100% - 70px)', marginRight: 8, padding: 8 }}
          required
        />
        <button type="submit" style={{ width: 60 }}>
          Kirim
        </button>
      </form>
    </div>
  );
}

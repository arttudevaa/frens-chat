import React, { useEffect, useState } from "react";

interface Message {
    id: number,
    sender: string,
    text: string,
    timestamp: Date,
  }

type Status = 'loading' | 'loaded' | 'error'

type ReturnType = [
  Message[], 
  React.Dispatch<React.SetStateAction<Message[]>>,
  Status
]


const useMessages = (): ReturnType => {
    const [messages, setMessages] = useState<Message[]>([])
    const [status, setStatus] = useState<Status>('loading')

    useEffect(() => {
        const fetchMessageHistory = async () => {
          try {
            const response = await fetch(`http://localhost:3001/api/messages`);
            const data = await response.json();
            setMessages(data)
            setStatus('loaded')
          } catch (error) {
            console.error('Error fetching message history:', error);
            setStatus('error')
          }
        };
    
        fetchMessageHistory();
    }, [])

    return [messages, setMessages, status]
}

export default useMessages;
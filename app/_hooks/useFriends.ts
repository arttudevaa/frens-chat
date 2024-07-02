import React, { useEffect, useState } from "react";

interface User {
    id: number,
    name: string,
  }

type Status = 'loading' | 'loaded' | 'error'

type ReturnType = [
  User[], 
  React.Dispatch<React.SetStateAction<User[]>>,
  Status
]


const useFriends = (): ReturnType => {
    const [friends, setFriends] = useState<User[]>([])
    const [status, setStatus] = useState<Status>('loading')

    useEffect(() => {
        const fetchFriends = async () => {
          try {
            const response = await fetch(`http://localhost:3001/api/user/123/friends`);
            const data = await response.json();
            setFriends(data)
            setStatus('loaded')
          } catch (error) {
            console.error('Error fetching message history:', error);
            setStatus('error')
          }
        };
    
        fetchFriends();
    }, [])

    return [friends, setFriends, status]
}

export default useFriends;
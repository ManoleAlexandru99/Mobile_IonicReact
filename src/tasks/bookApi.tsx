import axios from 'axios';
import { authConfig, baseFunction } from '../core';
import { BookProps } from './ItemProvider';


const baseUrl = 'localhost:3000';
const bookUrl = `http://${baseUrl}/api/book`;

interface ResponseProps<T> {
    data: T;
}

const config = {
    headers: {
        'Content-Type' : 'application/json'
    }
}

export const getBooks: (token: string) => Promise<BookProps[]> = token => {
    return baseFunction(axios.get(bookUrl, authConfig(token)), 'getBooks')
}

export const getFilteredBooks: (token: string, titlu: string) => Promise<BookProps[]> = (token,titlu) => {
  return baseFunction(axios.get(`${bookUrl}/filter/${titlu}`, authConfig(token)), 'getFilteredBooks')
}
export const createBook: (token: string, book : BookProps) => Promise<BookProps[]> = (token, book) => {
    return baseFunction(axios.post(bookUrl, book, authConfig(token)), 'createBook');
  }
  
  export const updateBook: (token: string, book: BookProps) => Promise<BookProps[]> = (token, book) => {
    return baseFunction(axios.put(`${bookUrl}/${book._id}`, book, authConfig(token)), 'updateBook');
  }

  interface MessageData {
    type: string;
    payload: BookProps;
  }

  export const newWebSocket = (token: string,onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`);
    ws.onopen = () => {
      console.log('web socket onopen');
      ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };
    ws.onclose = () => {
      console.log('web socket onclose');
    };
    ws.onerror = error => {
      console.log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
      console.log('web socket onmessage');
      onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
      ws.close();
    }
  }
  
  

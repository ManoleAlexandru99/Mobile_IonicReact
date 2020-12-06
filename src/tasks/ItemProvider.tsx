import { useState, useReducer, useEffect, useCallback, useContext } from 'react';
import {createBook, getBooks, getFilteredBooks, newWebSocket, updateBook} from './bookApi';
import PropTypes from 'prop-types';
import React from 'react';
import { AuthContext } from '../auth';
import { getLogger } from '../core';
import { Redirect } from 'react-router';

const log = getLogger('BookProvider');

export interface BookProps {
    _id?: string;
    titlu: string;
    autor: string;
    an: Date;
    disponibil: boolean;
    pret: number;
}

type SaveBookFn = (book: BookProps) => Promise<any>;

export interface BooksState{
    books?: BookProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveBook?: SaveBookFn,
}


/*
export interface BooksProps extends BooksState {
    addBook: () => void,
}
*/

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: BooksState = {
    fetching: false,
    saving: false,
  };

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';

const reducer: (state: BooksState, action: ActionProps) => BooksState =
  (state, { type, payload }) => {
    switch(type) {
      case FETCH_ITEMS_STARTED:
        return { ...state, fetching: true, fetchingError: null };
      case FETCH_ITEMS_SUCCEEDED:
        return { ...state, books: payload.books, fetching: false };
      case FETCH_ITEMS_FAILED:
        return { ...state, fetchingError: payload.error, fetching: false };
      case SAVE_ITEM_STARTED:
        return { ...state, savingError: null, saving: true };
      case SAVE_ITEM_SUCCEEDED:
        const books = [...(state.books || [])];
        const book = payload.book;
        const index = books.findIndex(it => it._id === book.id);
        if (index === -1) {
            //books.push(book)
            books.splice(0, 0, book);
        } else {
            //books.push(book)
            books[index] = book;
        }
        return { ...state,  books, saving: false };
      case SAVE_ITEM_FAILED:
        return { ...state, savingError: payload.error, saving: false };
      default:
        return state;
    }
  };

export const BookContext = React.createContext<BooksState>(initialState);

interface BookProviderProps {
    children: PropTypes.ReactNodeLike
}

export const BookProvider: React.FC<BookProviderProps> = ({ children }) => {
    const {token} = useContext(AuthContext)
    console.log(token)
    const [state, dispatch] = useReducer(reducer, initialState);
    const { books, fetching, fetchingError, saving, savingError } = state;
    useEffect(getBooksEffect, [token]);
    useEffect(getBooksFiltered, [token]);
    useEffect(wsEffect, [token]);
    const saveBook = useCallback<SaveBookFn>(saveBookCallback, [token]);
    const value = { books, fetching, fetchingError, saving, savingError, saveBook };
    console.log("Provider returns");
    return (
      <BookContext.Provider value={value}>
        {children}
      </BookContext.Provider>
    );

    function getBooksFiltered() {
      console.log("filtram")
      let canceled = false;
      //test();
      return () => {
        canceled = true;
        //Cancel 
      }

      async function test() {
        if (!token?.trim()) {
          return;
        }
        try {
          console.log('fetchBooks started');
          dispatch({ type: FETCH_ITEMS_STARTED });
          const books = await getFilteredBooks(token, "Test");
          console.log('fetchBooks succeeded');
          if (!canceled) {
            dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { books } });
          }
        } catch (error) {
          console.log('fetchBooks failed');
          dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
        }
    }
  }
  
    function getBooksEffect() {
      let canceled = false;
      fetchBooks();
      return () => {
        canceled = true;
        //Cancel 
      }
  
      async function fetchBooks() {
        if (!token?.trim()) {
          return;
        }
        try {
          console.log('fetchBooks started');
          dispatch({ type: FETCH_ITEMS_STARTED });
          const books = await getBooks(token);
          console.log(books)
          console.log('fetchBooks succeeded');
          if (!canceled) {
            dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { books } });
          }
        } catch (error) {
          console.log('fetchBooks failed');
          dispatch({ type: FETCH_ITEMS_FAILED, payload: { error } });
        }
      }
    }
  
    async function saveBookCallback(book: BookProps) {
      try {
        console.log('saveBook started');
        dispatch({ type: SAVE_ITEM_STARTED });
        console.log("ID-ul este:")
        console.log(book._id)
        console.log(book)
        const savedBook = await (book._id ? updateBook(token, book) : createBook(token, book));
        console.log('saveBook succeeded');
        dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { book : savedBook } });
      } catch (error) {
        console.log('saveBook failed');
        dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
      }
    }

    function wsEffect() {
      let canceled = false;
      console.log('wsEffect - connecting');
      let closeWebSocket: () => void;
      if (token?.trim()) {
        closeWebSocket = newWebSocket(token, message => {
          if (canceled) {
            return;
          }
          const { type, payload: book } = message;
          console.log(`ws message, item ${type}`);
          if (type === 'created' || type === 'updated') {
            dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { book } });
          }
        });
      }
      return () => {
        console.log('wsEffect - disconnecting');
        canceled = true;
        closeWebSocket?.();
      }
    }

  };



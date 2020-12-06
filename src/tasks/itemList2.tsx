import { IonLoading, IonList,IonContent,IonFab,IonFabButton,IonIcon, IonHeader, IonPage, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonSearchbar, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonButton } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import Book from './item';
import { add } from 'ionicons/icons'
import { Redirect, RouteComponentProps } from 'react-router';
import { BookContext, BookProps } from './ItemProvider';
import { AuthContext } from '../auth';



const BookList2: React.FC<RouteComponentProps> = ({history}) => {
  const [filter, setFilter] = useState<string | undefined>("undefined");
  const [displayed, setDisplayed] = useState<BookProps[]>([]);
  const [searchBook, setSearchBook] = useState<string>('');
  const {books, fetching, fetchingError} = useContext(BookContext);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const [position, setPosition] = useState(6);
  console.log("Book render");
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    if(books?.length)
        setDisplayed(books?.slice(0, 6));
}, [books]);

async function searchNext($event: CustomEvent<void>) {
  if(books && position < books.length) {
      if(filter)
          console.log(filter);
      setDisplayed([...displayed, ...books.slice(position, position + 6)]);
      setPosition(position + 6);
      console.log(position);
  } else {
      setDisableInfiniteScroll(true);
  }
  ($event.target as HTMLIonInfiniteScrollElement).complete();
}

const handleLogout = () => {
  logout?.();
  return <Redirect to={{ pathname: "/login" }} />;
}
  //test();
  /*
  async function test() {
    const url2 : string = `http://${baseUrl}/api/book/filter/Test`
    const res2: Response = await fetch(url2);
    res2
    .json()
    .then(async (res2) => {
    if (res2 && res2.message && res2.message.length > 0) {
      console.log(res2.message)
    } else {
      console.log("Test")
    }
    })
    .catch(err => console.error(err));
    }
    */
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Librarie</IonTitle>
          <IonButton className="logout-button" onClick={handleLogout} slot="end" expand="block" fill="solid" color="primary">
                        Logout
        </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <IonSearchbar
          value={searchBook}
          debounce={1000}
          onIonChange={e => setSearchBook(e.detail.value!)}>
      </IonSearchbar>
      <IonSelect value={filter} placeholder="Select autor" onIonChange={e => {
                          setFilter(e.detail.value);
                  }}>
                    <IonSelectOption value="Kurt Cobain" >Kurt Cobain</IonSelectOption>
                    <IonSelectOption value="Mihail Drumeș" >Mihail Drumeș</IonSelectOption>
                    <IonSelectOption value="undefined" >Fara filtru</IonSelectOption>
                  </IonSelect>
        <IonLabel> Lista cu filtrare: </IonLabel>
        <IonLoading isOpen = {fetching} message="Loading data" />
          {books && (
              <IonList>
                {books
                .filter(book  => book.autor === filter || filter === "undefined")
                .map(book => <Book key={book._id} _id={book._id} titlu={book.titlu} autor = {book.autor} an = {book.an} disponibil = {book.disponibil} pret = {book.pret} onEdit={id => history.push(`/book/${id}`)} />)}
             </IonList>
          )}
          {fetchingError && (
              <div> {fetchingError.message || `Failed to load books`} </div>
          )}
         <IonLabel> Lista cu cautari: </IonLabel>
        <IonLoading isOpen = {fetching} message="Loading data" />
          {books && (
              <IonList>
                {books
                .filter(book => book.titlu.indexOf(searchBook) >= 0)
                .map(book => <Book key={book._id} _id={book._id} titlu={book.titlu} autor = {book.autor} an = {book.an} disponibil = {book.disponibil} pret = {book.pret} onEdit={id => history.push(`/book/${id}`)} />)}
             </IonList>
          )}
          {fetchingError && (
              <div> {fetchingError.message || `Failed to load books`} </div>
          )}
          <IonInfiniteScroll
                    threshold="15px"
                    disabled={disableInfiniteScroll}
                    onIonInfinite={(e: CustomEvent<void>) => {
                        searchNext(e);
                    }}>
                    <IonInfiniteScrollContent loadingText="Loading more books ..."/>
            </IonInfiniteScroll>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/book')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonFabButton onClick={() => history.push('/dogs')}>
        </IonFabButton>
      </IonContent>
    </IonPage>
  );
};

export default BookList2;
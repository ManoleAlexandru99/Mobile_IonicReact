import { IonLoading, IonList,IonContent,IonFab,IonFabButton,IonIcon, IonHeader, IonPage, IonTitle, IonToolbar, IonSelect, IonSelectOption } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import Book from './item';
import { add } from 'ionicons/icons'
import { RouteComponentProps } from 'react-router';
import { BookContext, BookProps } from './ItemProvider';
import { baseUrl } from '../core';

const BookList: React.FC<RouteComponentProps> = ({history}) => {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const {books, fetching, fetchingError} = useContext(BookContext);
  console.log("Book render");
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
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen = {fetching} message="Loading data" />
        {books && (
            <IonList>
                { console.log(books) };
                {books.map(({ _id, titlu, autor, an, disponibil, pret}) => <Book key={_id} _id={_id} titlu={titlu} autor = {autor} an = {an} disponibil = {disponibil} pret = {pret} onEdit={id => history.push(`/book/${id}`)} />)}
            </IonList>
        )}
        {fetchingError && (
            <div> {fetchingError.message || `Failed to load books`} </div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/book')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default BookList;
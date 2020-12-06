import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { BookContext, BookProps } from './ItemProvider';
import { RouteComponentProps } from 'react-router';



interface BookEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const BookEdit: React.FC<BookEditProps> = ({ history, match }) => {
  const { books, saving, savingError, saveBook } = useContext(BookContext);
  const [book, setBook] = useState<BookProps>();
  const [titlu, setTitlu] = useState("");
  const [autor, setAutor] = useState("");
  const [an, setAn] = useState(new Date());
  const [disponibil, setDisponibil] = useState(false);
  const [pret, setPret] = useState(10);
  useEffect(() => {
    console.log('useEffect');
    const routeId = match.params.id || '';
    console.log(routeId)
    //const book = books?.find(it => it.id === routeId);
    const book = books?.find((book: any) => book._id === routeId); 
    setBook(book);
    if (book) {
        
        setTitlu(book.titlu);
        setAutor(book.autor);
        setAn(book.an);
        setDisponibil(book.disponibil);
        setPret(book.pret);
    }
  }, [match.params.id, books]);
  const handleSave = () => {
    const editedBook = book ? { ...book, titlu,autor, an, disponibil, pret } : { titlu, autor, an, disponibil, pret };
    saveBook && saveBook(editedBook).then(() => history.goBack());
  };
  console.log('render');
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput value={titlu} onIonChange={e => setTitlu(e.detail.value || '')} />
        <IonInput value={autor} onIonChange={e => setAutor(e.detail.value || '')} />
        <IonInput type="number" value={pret} onIonChange={e => setPret(parseInt(e.detail.value!, 10))}></IonInput>
                <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BookEdit;

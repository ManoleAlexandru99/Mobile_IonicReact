import React from 'react';
import Moment from 'moment';
import { IonDatetime, IonItem, IonLabel } from '@ionic/react';
import { BookProps } from './ItemProvider';

interface ItemProps {
    _id?: string;
    text: string;
}


const Item: React.FC<ItemProps> = ({ _id, text }) => {
  return (
    <div>{text}</div>
  );
};

interface BookPropsExt extends BookProps {
    onEdit: (_id?: string) => void;
}


const Book: React.FC<BookPropsExt> = ({ _id, titlu, autor, an, disponibil, pret, onEdit }) => {
    return (
    <IonItem onClick={() => onEdit(_id)}>
      <IonLabel>{"\"" +  titlu + "\"" + " de " + autor + " apărută în  " +  an.toLocaleString().substr(0,4) + " costă " +  pret.toString()  + " Lei"}</IonLabel>
    </IonItem>
    );
  };

export default Book;
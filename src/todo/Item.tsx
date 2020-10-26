import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, text,published, available, onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(id)}>
      <IonLabel>{text}</IonLabel>
      <IonLabel>{published}</IonLabel>
      <IonLabel>{available}</IonLabel>
    </IonItem>
  );
};

export default Item;

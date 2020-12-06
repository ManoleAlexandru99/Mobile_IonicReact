import {
    IonCard,
    IonContent,
    IonHeader,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter
  } from '@ionic/react';
  import React, { useEffect, useState } from 'react';
import { baseUrl } from '../core';
  
  const Dog: React.FC = () => {
    const [breeds, setBreeds] = useState<string[]>([]);
    const [items, setItems] = useState<string[]>([]);
    const [filter, setFilter] = useState<string | undefined>(undefined);
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  
    async function fetchBreeds() {
      const url: string = 'https://dog.ceo/api/breeds/list/all';
      const res: Response = await fetch(url);

      /*
      const res1 : Response = await fetch("https://imdb8.p.rapidapi.com/actors/list-born-today?day=27&month=7", {
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "38c8b4e801mshc275df0377192b5p17d712jsn89226c4be0ad",
          "x-rapidapi-host": "imdb8.p.rapidapi.com"
        }
      */
      /*
      })
      res1
      .json()
      .then(async (res1) => {
        console.log(Object)
        console.log(Object.keys(res1.message || {}))
        setBreeds(Object.keys(res1.message || {}));
      })
      .catch(err => console.error(err));
      */
      res
        .json()
        .then(async (res) => {
          setBreeds(Object.keys(res.message || {}));
        })
        .catch(err => console.error(err));
      
    }
  
    async function fetchData(reset?: boolean) {
      const dogs: string[] = reset ? [] : items;
      const url: string = filter ? `https://dog.ceo/api/breed/${filter}/images/random/3` : 'https://dog.ceo/api/breeds/image/random/3';
      //const url2 : string = `http://${baseUrl}/api/book/filter/15`
      const res: Response = await fetch(url);
      res
        .json()
        .then(async (res) => {
          if (res && res.message && res.message.length > 0) {
            setItems([...dogs, ...res.message]);
            setDisableInfiniteScroll(res.message.length < 3);
          } else {
            setDisableInfiniteScroll(true);
          }
        })
        .catch(err => console.error(err));
      /*
      const res2: Response = await fetch(url2);
      res2
        .json()
        .then(async (res2) => {
          if (res2 && res2.message && res2.message.length > 0) {
            console.log(res2.message)
          } else {
            setDisableInfiniteScroll(true);
          }
        })
        .catch(err => console.error(err));
        */
    }
    
    useEffect(() => {
      fetchData(true);
    }, [filter]);
  
    async function searchNext($event: CustomEvent<void>) {
      await fetchData();
      ($event.target as HTMLIonInfiniteScrollElement).complete();
    }
  
    useIonViewWillEnter(async () => {
      await fetchBreeds();
    });
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Dog</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonSelect value={filter} placeholder="Select Breed" onIonChange={e => setFilter(e.detail.value)}>
            {breeds.map(breed => <IonSelectOption key={breed} value={breed}>{breed}</IonSelectOption>)}
          </IonSelect>
          {items.map((item: string, i: number) => {
            return <IonCard key={`${i}`}><img src={item}/></IonCard>
          })}
          <IonInfiniteScroll threshold="100px" disabled={disableInfiniteScroll}
                             onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
            <IonInfiniteScrollContent
              loadingText="Loading more good doggos...">
            </IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Dog;
  
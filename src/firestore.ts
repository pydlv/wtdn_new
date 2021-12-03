import {firebase} from "@/firebase";
import FirebaseFirestore from "@firebase/firestore-types";
import {Task} from "@/dao/task";
import {Planner} from "@/dao/planner";

export type HasID<T> = T & {
    id: string
}

const converter = <T>() => ({
    toFirestore: (data: Partial<T>) => data,
    fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot): HasID<T> => {
        return {
            id: snap.id,
            ...snap.data() as T,
        } as HasID<T>
    }
});

const dataPoint = <T>(collectionPath: string) => firebase.firestore().collection(collectionPath).withConverter(converter<T>())

export const db = {
    // list your collections here
    // users: dataPoint<User>('users')
    tasks: dataPoint<Task>('tasks'),
    planners: dataPoint<Planner>('planners')
};

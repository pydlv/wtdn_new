import {firebase} from "@/firebase";
import FirebaseFirestore from "@firebase/firestore-types";
import {Task} from "@/dao/task";

const converter = <T>() => ({
    toFirestore: (data: Partial<T>) => data,
    fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => snap.data() as T
});

const dataPoint = <T>(collectionPath: string) => firebase.firestore().collection(collectionPath).withConverter(converter<T>())

export const db = {
    // list your collections here
    // users: dataPoint<User>('users')
    tasks: dataPoint<Task>('tasks')
};

import firebase from "firebase";
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import SnapshotOptions = firebase.firestore.SnapshotOptions;

export class Planner {
    email: string;

    constructor(email: string) {
        this.email = email;
    }
}

export const PlannerConverter = {
    toFirestore: (planner: Planner) => {
        return {
            email: planner.email
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new Planner(data.email);
    }
}

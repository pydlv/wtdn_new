import {authModule} from "@/store";
import {db} from "@/firestore";

export interface Planner {
    id?: string;
    email: string;
}

export async function getOrCreatePlanner() {
    if (!authModule.isLoggedIn) {
        throw "Must be logged in to create planner.";
    }

    const email = authModule.user!.email!;
    const result = await db.planners.where('email', '==', email).get();

    if (result.empty) {
        // Need to create the new planner
        const newPlanner: Planner = {
            email
        };

        const doc = await db.planners.add(newPlanner);

        newPlanner.id = doc.id;

        return newPlanner;
    } else {
        return {
            ...result.docs[0].data(),
            id: result.docs[0].id
        };
    }
}

// import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
// import SnapshotOptions = firebase.firestore.SnapshotOptions;
//
// export class Planner {
//     email: string;
//
//     constructor(email: string) {
//         this.email = email;
//     }
// }

// export const PlannerConverter = {
//     toFirestore: (planner: Planner) => {
//         return {
//             email: planner.email
//         };
//     },
//     fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
//         const data = snapshot.data(options);
//         return new Planner(data.email);
//     }
// }

import {Action, Module, Mutation, VuexModule} from "vuex-class-modules";
import firebase from 'firebase/app';
import {auth} from "@/firebase";
import User = firebase.User;

@Module
export default class AuthModule extends VuexModule {
    user: User | null = null;

    @Mutation
    setUser(newUser: User | null) {
        this.user = newUser;
    }

    get isLoggedIn(): boolean {
        return this.user !== null;
    }

    @Action
    async tryLogin(credentials: { email: string, password: string }) {
        const { email, password } = credentials;
        const credential = await auth.signInWithEmailAndPassword(email, password);
        this.setUser(credential.user);
    }

    @Action
    async trySignUp(credentials: {email: string, password: string}) {
        const {email, password} = credentials;
        const credential = await auth.createUserWithEmailAndPassword(email, password);
        this.setUser(credential.user);
    }
}

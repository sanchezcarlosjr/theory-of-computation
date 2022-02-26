import {FirebaseAuthProvider} from "react-admin-firebase";
import {firebaseConfig, options} from "./firebaseConfig";

export const authProvider = FirebaseAuthProvider(firebaseConfig, options);
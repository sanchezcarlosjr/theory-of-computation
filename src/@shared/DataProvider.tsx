import {FirebaseDataProvider} from "react-admin-firebase";
import {firebaseConfig, options} from "./firebaseConfig";

export const dataProvider = FirebaseDataProvider(firebaseConfig, options);
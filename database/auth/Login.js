import ManageUser from "./ManageUser";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default class LoginUser {
  static loginUser = (userData, setUser, setError, router, setLoggedIn) => {
    const { email, password } = userData;
    const auth = getAuth();
    if (typeof window === "undefined") return;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);

        localStorage.setItem("Email", user.email);
        ManageUser.storeUserID(user.email);
        setLoggedIn(true);
        router.push("/Home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };
}

// import { Auth, fetchSignInMethodsForEmail } from "firebase/auth";
//
// type EmailExists = {
//   exists: boolean;
//   exists_method?: string[] | null;
//   error?: string | null;
// };
//
// export const checkIfEmailExistsInFirebaseAuth = async (
//   email: string,
//   auth: Auth,
// ): Promise<EmailExists> => {
//   try {
//     const signInMethods = await fetchSignInMethodsForEmail(auth, email);
//     if (signInMethods.length > 0) {
//       return {
//         exists: true,
//         exists_method: signInMethods,
//       };
//     } else {
//       return { exists: false };
//     }
//   } catch (error: any) {
//     console.error("Error checking email:", error.message);
//     return { exists: false, error: error.message || "Error checking email" };
//   }
// };
//
// // export const methodIconMap = {
// //   "password": ,
// //   "google.com": ,
// //   "github.com": ,
// // }

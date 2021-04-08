import Cookies from 'js-cookie';
import logout from './logout';

export default function asyncAPICall(
   api_endpoint,
   method = "GET",
   body = {},
   response_callback_method = null,
   data_callback_method = null,
   catch_callback_method = null,
   require_auth_token = true
) {
   let auth_token = Cookies.get('auth_token');


   if (!require_auth_token) {
      auth_token = "not_required"
   } else {
      if (!auth_token || auth_token === '') {
         console.log("Auth Token Required")
         return false;
      }
      let expiration = Cookies.get('auth_expires');
      if (Date.parse(expiration) < Date.now()) {
         // We have an expired token, so, break
         console.log("Expired Auth Token");
         return false;
      }
   }

   if (auth_token) {

      let payload = { method: method, headers: { "content-type": "application/json", "auth_token": auth_token } }
      if (method === "POST") {
         payload.body = JSON.stringify(body)
      }
      let response_function = response => {
         if (response.ok) {
            return response.json();
         } else if (response.status === 403 || response.status === 401) {
            logout();
         }
         let error = new Error(response.statusText)
         error.response = response
         throw error
      }
      if (response_callback_method) {
         response_function = response_callback_method
      }
      let data_function = data => { }
      if (data_callback_method) {
         data_function = data_callback_method
      }
      let catch_function = error => console.log(error)
      if (catch_callback_method) {
         catch_function = catch_callback_method
      }
      // TODO : Replace host and port with config variables
      fetch(`http://127.0.0.1:5000${api_endpoint}`, payload)
         .then(response_function)
         .then(data_function)
         .catch(catch_function)

      return true
   } else {
      return false
   }
}

export function awaitAPICall(
   api_endpoint,
   method = "GET",
   body = {},
   response_callback_method = null,
   data_callback_method = null,
   catch_callback_method = null,
   require_auth_token = true
) {
   let auth_token = Cookies.get('auth_token');
   let expiration = Cookies.get('auth_expires');
   if (Date.parse(expiration) < Date.now()) {
      // We have an expired token, so, break
      console.log("Expired Auth Token");
      return false;
   }


   if (!require_auth_token) {
      auth_token = "not_required"
   }
   if (auth_token) {
      let payload = { method: method, headers: { "content-type": "application/json", "auth_token": auth_token } }
      if (method === "POST") {
         payload.body = JSON.stringify(body)
      }
      let response_function = response => {
         if (response.ok) {
            return response.json();
         } else if (response.status === 403 || response.status === 401) {
            // Cookies.remove('auth_token');
            return false;
         }
         let error = new Error(response.statusText)
         error.response = response
         throw error
      }
      if (response_callback_method) {
         response_function = response_callback_method
      }
      let data_function = data => { }
      if (data_callback_method) {
         data_function = data_callback_method
      }
      let catch_function = error => console.log(error)
      if (catch_callback_method) {
         catch_function = catch_callback_method
      }

      let fetchFromAPI = async () => {
         try {
            // TODO : Replace host and port with config variables
            let response = await fetch(`http://127.0.0.1:5000${api_endpoint}`, payload);
            let results = await response_function(response);
            await data_function(results);
         } catch (error) {
            catch_function(error)
            return false;
         }
      }

      fetchFromAPI();

      return true;
   } else {
      return false
   }
}
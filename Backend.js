// POST API
const sign_up_api = "http://localhost:8000/api/signup";
const login_post_api = "http://localhost:8000/api/login";
const events_post_api = "http://localhost:8000/api/events";

// GET API
// const sports_geojson_api = "http://localhost:8000/api/sports_geojson";
// const all_events_get_api = "http://localhost:8000/api/events?skip=0&limit=10";

// async function signUp(userData) {
//    try {
//       const response = await fetch(sign_up_api, {
//          method: 'POST',
//          headers: {
//             'Content-Type': 'application/json'
//          },
//          body: JSON.stringify(userData)
//       });
//       if (!response.ok) {
//          throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       return data;
//    } catch (error) {
//       console.error('There was a problem with the sign-up request:', error);
//    }
// }
// async function login(userData) {
//    try {
//       const response = await fetch(login_post_api, {
//          method: 'POST',
//          headers: {
//             'Content-Type': 'application/json'
//          },
//          body: JSON.stringify(userData)
//       });
//       if (!response.ok) {
//          throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       return data;
//    } catch (error) {
//       console.error('There was a problem with the login request:', error);
//    }
// }
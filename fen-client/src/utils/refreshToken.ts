import axios from 'axios';
import { serverUrl } from './constants';

export async function refreshToken(errorFn: Function) {
  await axios({
    method: 'get',
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    url: serverUrl + 'refresh/token',
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      if (error.response.status === 401) {
        errorFn();
      }
    });
}

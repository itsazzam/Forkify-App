import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchRes = fetch(url);
    const result = await Promise.race([fetchRes, timeout(TIMEOUT_SEC)]);
    const data = await result.json();
    if (!result.ok) throw new Error(`${data.message}`);

    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async function (url, uploadedData) {
  try {
    const fetchRes = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadedData),
    });
    const result = await Promise.race([fetchRes, timeout(TIMEOUT_SEC)]);
    const data = await result.json();
    if (!result.ok) throw new Error(`${data.message}`);

    return data;
  } catch (error) {
    throw error;
  }
};

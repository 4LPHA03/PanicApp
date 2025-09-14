import { encode as btoa } from 'base-64';

const MATRIX_HOMESERVER = 'https://matrix.org';
const MATRIX_ROOM_ID = '!ULCchWMQuEerGkCTFR:matrix.org';
const MATRIX_ACCESS_TOKEN = 'mct_1pZnAlaWZK3swrFapQxhmdvEufGOKQ_i2XtH3';

export async function sendMatrixAlert(imageBase64: string, latitude: number, longitude: number) {
  const body = {
    msgtype: 'm.text',
    body: `🚨 Alert! Lokalizacja: ${latitude}, ${longitude}\nZdjęcie w załączniku`,
  };

  
  await fetch(`${MATRIX_HOMESERVER}/_matrix/client/r0/rooms/${MATRIX_ROOM_ID}/send/m.room.message?access_token=${MATRIX_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });


  const uploadData = await fetch(`${MATRIX_HOMESERVER}/_matrix/media/r0/upload?access_token=${MATRIX_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: Buffer.from(imageBase64, 'base64'),
  });

  const result = await uploadData.json();
  const mxcUrl = result.content_uri;

  await fetch(`${MATRIX_HOMESERVER}/_matrix/client/r0/rooms/${MATRIX_ROOM_ID}/send/m.room.message?access_token=${MATRIX_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      msgtype: 'm.image',
      body: 'Zdjęcie z alertu',
      url: mxcUrl,
    }),
  });
}

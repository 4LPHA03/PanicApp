import React, { useState, useEffect, useRef } from "react";
import { View, Button, Image, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from "expo-location";
                                                                                                                // legacy API z EFS
import * as FileSystem from 'expo-file-system/legacy';
import { MATRIX_HOMESERVER, MATRIX_ROOM_ID, MATRIX_ACCESS_TOKEN } from './config';

export default function App() {
  const [hasCameraPermission, requestCameraPermission] = useCameraPermissions();
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
    
      const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locStatus === "granted");
    })();
  }, []);

  const takePhotoAndSend = async () => {
    if (!cameraRef.current) return;

    try {
     
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setPhotoUri(photo.uri);

    
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

   
      console.log("Wysyłanie zdjęcia jako załącznik...");
      
      const fileData = await FileSystem.readAsStringAsync(photo.uri, { 
        encoding: FileSystem.EncodingType.Base64 
      });

     
      const binaryData = atob(fileData);
      const uint8Array = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

                                                    // Upload pic do matrixa
      const uploadResponse = await fetch(
        `${MATRIX_HOMESERVER}/_matrix/media/r0/upload?filename=panic_photo.jpg`,
        {
          method: "POST",
          headers: {
            "Content-Type": "image/jpeg",
            "Authorization": `Bearer ${MATRIX_ACCESS_TOKEN}`
          },
          body: uint8Array
        }
      );

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json();
        throw new Error(`Błąd uploadu: ${uploadResponse.status} - ${JSON.stringify(uploadError)}`);
      }

      const uploadData = await uploadResponse.json();
      const contentUri = uploadData.content_uri;
      console.log("Zdjęcie uploaded:", contentUri);

                                                                                         // msg link do lokalizacji
      const payload = {
        msgtype: "m.text",
        body: `Zdjęcie z lokalizacją: https://www.google.com/maps?q=${latitude},${longitude}`,
        format: "org.matrix.custom.html",
        formatted_body: `
          <img src="${MATRIX_HOMESERVER}/_matrix/media/r0/download/${contentUri.replace('mxc://', '')}" 
               width="300" /><br>
          Lokalizacja: ${latitude}, ${longitude}<br>
          <a href="https://www.google.com/maps?q=${latitude},${longitude}">Otwórz w Google Maps</a>
        `
      };

      console.log("Wysyłanie wiadomości do Matrix...");
      const messageResponse = await fetch(
        `${MATRIX_HOMESERVER}/_matrix/client/r0/rooms/${MATRIX_ROOM_ID}/send/m.room.message?access_token=${MATRIX_ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

                                                                                                 // srv respond
      const responseData = await messageResponse.json();
      console.log("Odpowiedź Matrix:", responseData);
      console.log("Status HTTP:", messageResponse.status);

      if (!messageResponse.ok) {
        throw new Error(`Błąd Matrix: ${messageResponse.status} - ${JSON.stringify(responseData)}`);
      }
      
      Alert.alert("Sukces", "Wysłano zdjęcie z lokalizacją do Matrix!");
      
    } catch (error) {
      console.error("Pełny błąd:", error);
      Alert.alert("Błąd", `Nie udało się wysłać wiadomości: ${error.message}`);
    }
  };

 
  if (!hasCameraPermission) {
    return (
      <View style={styles.container}>
        <Button title="Udziel uprawnień do kamery" onPress={requestCameraPermission} />
      </View>
    );
  }

  if (!hasCameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Button title="Udziel uprawnień do kamery" onPress={requestCameraPermission} />
      </View>
    );
  }

  if (hasLocationPermission === null) {
    return <View style={styles.container}><Button title="Proszę czekać..." disabled /></View>;
  }

  if (!hasLocationPermission) {
    return <View style={styles.container}><Button title="Brak uprawnień do lokalizacji" disabled /></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={"back"}
        ref={cameraRef}
      />
      <Button title="Zrób zdjęcie i wyślij" onPress={takePhotoAndSend} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center'
  },
  camera: { 
    flex: 3 
  },
  preview: { 
    flex: 1, 
    marginTop: 10 
  }
});
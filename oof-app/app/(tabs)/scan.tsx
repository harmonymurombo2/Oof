//oof-app/app/(tabs)/scan.tsx
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { router } from "expo-router";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  async function takePicture() {
    if (!cameraRef.current) return;
    
    try {
      const { uri } = await cameraRef.current.takePictureAsync();
      setPhoto(uri);
      
      // Navigate to receipt creation with photo
      router.push({
        pathname: "/receipt/new",
        params: { photoUri: uri }
      });
    } catch (error) {
      Alert.alert("Error", "Failed to take picture");
    }
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need camera permission to scan receipts</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera}
        facing="back"
      >
        <View style={styles.overlay}>
          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },
  overlay: { 
    flex: 1, 
    justifyContent: "flex-end", 
    alignItems: "center",
    paddingBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#6C63FF",
  },
  text: { color: "white", textAlign: "center", margin: 20 },
  button: { 
    backgroundColor: "#6C63FF", 
    padding: 15, 
    borderRadius: 10,
    margin: 20,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
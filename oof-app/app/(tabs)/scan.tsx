//oof-app/app/(tabs)/scan.tsx
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  async function takePicture() {
    if (!cameraRef.current) return;
    
    try {
      const { uri } = await cameraRef.current.takePictureAsync();
      setPhoto(uri);
      
      router.push({
        pathname: "/receipt/new",
        params: { photoUri: uri }
      });
    } catch (error) {
      Alert.alert("Error", "Failed to take picture");
    }
  }

  async function pickFromGallery() {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert("Permission needed", "Please grant gallery access to upload receipts");
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setPhoto(uri);
        
        router.push({
          pathname: "/receipt/new",
          params: { photoUri: uri }
        });
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  }

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need camera permission to scan receipts</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickFromGallery} style={[styles.button, styles.galleryButton]}>
          <Text style={styles.buttonText}>📁 Upload from Gallery</Text>
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
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={pickFromGallery} style={styles.galleryIconButton}>
              <Ionicons name="images-outline" size={30} color="white" />
              <Text style={styles.iconLabel}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
            
            <View style={styles.placeholder} />
          </View>
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
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 30,
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
  galleryIconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  placeholder: {
    width: 50,
  },
  text: { color: "white", textAlign: "center", margin: 20, fontSize: 16 },
  button: { 
    backgroundColor: "#6C63FF", 
    padding: 15, 
    borderRadius: 10,
    margin: 10,
    minWidth: 200,
    alignItems: "center",
  },
  galleryButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});
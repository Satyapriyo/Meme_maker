import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Platform } from "react-native";
import ImageViewer from "./components/ImageViewer";
import { useState, useRef } from "react";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import IconButtons from "./components/IconButtons";
import CircleButton from "./components/CircleButton";

import Button from "./components/Button";
const PlaceHolderImage = require("./assets/images/background-image.png");
import * as ImagePicker from "expo-image-picker";
import EmojiPicker from "./components/EmojiPicker";
import EmojiList from "./components/EmojiList";
import EmojiSticker from "./components/EmojiSticker";
import DomToImage from "dom-to-image";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [pickedEmoji, setPickEmoji] = useState(null);

  const imageRef = useRef();

  if (status == null) {
    requestPermission();
  }
  const onReset = () => {
    setShowAppOptions(false);
  };
  const onAddSticker = () => {
    setModalVisible(true);
  };
  const onModalClose = () => {
    setModalVisible(false);
  };
  const onSaveImageAsync = async () => {
    if (Platform.OS !== "web") {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Saved!");
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataUrl = await DomToImage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement("a");
        link.download = "sticker-smash.jpeg";
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };
  const picImageAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("you did not select any image");
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer
            PlaceHolderImageSource={PlaceHolderImage}
            selectedImage={selectedImage}
          />
          {pickedEmoji !== null ? (
            <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
          ) : null}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsConatainer}>
          <View style={styles.optionRow}>
            <IconButtons icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButtons
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerConatainer}>
          <Button
            theme="primary"
            label="Choose the photo"
            onPress={picImageAsync}
          />
          <Button
            label="Use the photo"
            onPress={() => setShowAppOptions(true)}
          />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerConatainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsConatainer: {
    position: "absolute",
    bottom: 80,
  },
  optionRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});

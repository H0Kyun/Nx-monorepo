import { View, StyleSheet, Alert, ImageSourcePropType } from 'react-native';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useRef, useState } from 'react';
import { saveToLibraryAsync, usePermissions } from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

import ImageViewer from '@/components/ImageViewer';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiList from '@/components/EmojiList';
import EmojiSticker from '@/components/EmojiSticker';


const PlaceHolderImage = require('@assets/images/adaptive-icon.png');

export default function HomeScreen() {
    const [permissionResponse, requestPermission] = usePermissions();
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pickedEmoji, setPickedEmoji] = useState<ImageSourcePropType | undefined>(undefined);

    const imageRef = useRef<View>(null);

    useEffect(() => {
        if(!permissionResponse?.granted) {
            requestPermission();
        }
    }, []);

    const pickImageAsync = async () => {
        let result = await launchImageLibraryAsync({mediaTypes: ['images'], allowsEditing: false, quality: 1,});

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
        } else {
            Alert.alert('You did not select any image.');
        }
    }

    const onReset = () => {
        setShowAppOptions(false);
    };
    
    const onAddSticker = () => {
        setIsModalVisible(true);
    };

    const onModalClose = () => {
        setIsModalVisible(false);
    }
    
    const onSaveImageAsync = async () => {
        try {
          const localUri = await captureRef(imageRef, {
            quality: 1,
          });
    
          await saveToLibraryAsync(localUri);
          if (localUri) {
            Alert.alert('Saved!');
          }
        } catch (e) {
          console.log(e);
        }
      };
    // TODO: skia로 커스텀 캔버스로 작동하도록 수정(텍스트, 스티커, 등 올릴 수 있게)
    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.imageContainer}>
                <View ref={imageRef} collapsable={false}>
                    <ImageViewer imgSource={PlaceHolderImage} selectedImageUri={selectedImage} />
                    {/* TODO: 이모지 여러 개 선택해서 화면에 띄우도록 수정 */}
                    {pickedEmoji && <EmojiSticker stickerSource={pickedEmoji} />}
                </View>
            </View>
            {showAppOptions ? (
                <View style={styles.optionsContainer}>
                    <View style={styles.optionsRow}>
                        <IconButton icon="refresh" label="Reset" onPress={onReset} />
                        <CircleButton onPress={onAddSticker} />
                        <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                    </View>
                </View>
            ) : (
                <View style={styles.footerContainer}>
                    <Button label="Choose a photo" theme='primary' onPress={pickImageAsync} />
                    <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
                </View>
            )}
            <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
                <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
            </EmojiPicker>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 28,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

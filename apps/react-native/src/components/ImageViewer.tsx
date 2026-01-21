import { useEffect, useState } from 'react';
import { Image as RNImage, ImageSourcePropType, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  imgSource: ImageSourcePropType;
  selectedImageUri: string | undefined;
};

export default function ImageViewer({ imgSource, selectedImageUri }: Props) {
  const imageSource = selectedImageUri ? { uri: selectedImageUri } : imgSource;
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (selectedImageUri) {
      // 원격 이미지 크기 조회
      RNImage.getSize(
        selectedImageUri,
        (width, height) => {
          if (width && height) setAspectRatio(width / height);
        },
        () => {
          // 실패 시 aspectRatio 미설정 (스타일의 기본값 사용)
          setAspectRatio(undefined);
        }
      );
    } else if (imgSource) {
      // 로컬 require 자산의 크기 조회
      const resolved = RNImage.resolveAssetSource(imgSource as any);
      if (resolved?.width && resolved?.height) {
        setAspectRatio(resolved.width / resolved.height);
      } else {
        setAspectRatio(undefined);
      }
    }
  }, [selectedImageUri, imgSource]);

  return (
    <Image
      source={imageSource}
      style={[styles.image, aspectRatio ? { aspectRatio } : null]}
      contentFit="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    maxHeight: 440,
    borderRadius: 18,
  },
});

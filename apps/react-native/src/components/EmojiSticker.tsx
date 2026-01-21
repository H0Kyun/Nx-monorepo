import { ImageSourcePropType, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue }  from 'react-native-reanimated';


type Props = {
  stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ stickerSource }: Props) {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const rotation = useSharedValue(0);
    const savedRotation = useSharedValue(0);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const minScale = 0.1;
    
    const zoom = Gesture.Pinch()
    .onUpdate((event) => {
        const next = savedScale.value * event.scale;
        scale.value = Math.max(next, minScale);
      })
      .onEnd(() => {
        savedScale.value = Math.max(scale.value, minScale);
      });

    const rotate = Gesture.Rotation()
    .onUpdate((event) => {
        rotation.value = event.rotation;
    })
    .onEnd(() => {
        savedRotation.value = rotation.value;
    });

    const drag = Gesture.Pan().onChange((event) => {
        translateX.value += event.changeX;
        translateY.value += event.changeY;
    })
    
    const containerStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    }));
    
    const stickerStyle = useAnimatedStyle(() => ({
      transform: [{ rotateZ: `${(rotation.value / Math.PI) * 180}deg` }, { scale: scale.value }],
      
    }));

    const composed = Gesture.Simultaneous(drag, zoom, rotate);

    return (
        <GestureDetector gesture={composed}>
          <Animated.View style={[containerStyle, { position: 'absolute', top: 0, left: 0 }]}>
            <Animated.Image
            source={stickerSource}
            resizeMode="contain"
            style={stickerStyle}
            />
          </Animated.View>
        </GestureDetector>
    );
}

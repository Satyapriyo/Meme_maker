import { View, Image, ImageBase } from "react-native";
import {
  TapGestureHandler,
  PanGestureHandler,
} from "react-native-gesture-handler";
import {
  useAnimatedStyle,
  useSharedValue,
  useAnimatedGestureHandler,
  withSpring,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimagedView = Animated.createAnimatedComponent(View);
export default function EmojiSticker({ imageSize, stickerSource }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const scaleImage = useSharedValue(imageSize);

  const imageStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    };
  });
  const onDoubleTap = useAnimatedGestureHandler({
    onActive: () => {
      if (scaleImage.value !== imageSize * 2) {
        scaleImage.value = imageSize * 2;
      }
    },
  });
  const onDrag = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
  });
  const conatainrStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });
  return (
    <PanGestureHandler onGestureEvent={onDrag}>
      <AnimagedView style={[conatainrStyle, { top: -350 }]}>
        <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
          <AnimatedImage
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </TapGestureHandler>
      </AnimagedView>
    </PanGestureHandler>
  );
}

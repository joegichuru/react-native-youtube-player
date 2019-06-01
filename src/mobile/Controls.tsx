import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Text } from "react-native";
import { PlayIcon, PauseIcon, FSIcon, ExitFSIcon } from "./icons";
import ProgressBar from "./ProgressBar";
import { sec2time } from "./Utils";

const TIME_TO_HIDE_CONTROLS = 4000;

type Props = {
  play: Boolean;
  fullScreen: Boolean;
  duration: number;
  currentTime: number;
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (t: number) => void;
  toggleFS: () => void;
};

export default ({
  play,
  duration,
  currentTime,
  playVideo,
  pauseVideo,
  seekTo,
  toggleFS,
  fullScreen
}: Props) => {
  const [visible, setVisible] = useState(true);
  const ref: { current: any } = useRef(0);
  const hideControls = () => {
    if (ref.current !== 0) clearTimeout(ref.current);
    if (play) {
      ref.current = setTimeout(() => {
        setVisible(false);
      }, TIME_TO_HIDE_CONTROLS);
    }
  };
  const hideAfterExecute = (action: Function) => {
    hideControls();
    return action;
  };
  useEffect(() => {
    hideControls();
    return () => {
      clearTimeout(ref.current);
    };
  }, [play]);
  const progress =
    currentTime !== 0 && duration !== 0 ? currentTime / duration : 0;

  return (
    <View
      style={[styles.container, { paddingHorizontal: fullScreen ? 40 : 0 }]}
    >
      <TouchableWithoutFeedback
        onPress={() => hideAfterExecute(setVisible)(true)}
        style={styles.upperView}
      >
        <View style={styles.upperView} />
      </TouchableWithoutFeedback>

      {visible && (
        <TouchableWithoutFeedback
          onPress={() =>
            hideAfterExecute(() => {
              console.log("yess I am here ");
            })()
          }
        >
          <View
            style={[
              styles.controls,
              { paddingHorizontal: fullScreen ? 40 : 5 }
            ]}
          >
            {play ? (
              <PauseIcon onPress={pauseVideo} />
            ) : (
              <PlayIcon onPress={playVideo} />
            )}
            <View style={[styles.footer, { bottom: fullScreen ? 30 : 10 }]}>
              <Text style={styles.text}> {sec2time(currentTime)} </Text>
              <View style={styles.footerRight}>
                <Text style={styles.text}> {sec2time(duration)} </Text>
                {fullScreen ? (
                  <ExitFSIcon size={16} onPress={toggleFS} />
                ) : (
                  <FSIcon size={16} onPress={toggleFS} />
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      <ProgressBar
        value={progress}
        {...{ fullScreen, visible, seekTo, duration, pauseVideo, playVideo }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: "100%"
  },
  upperView: {
    ...StyleSheet.absoluteFillObject
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute"
  },
  text: {
    color: "#FFF",
    fontSize: 12,
    marginRight: 0
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center"
  },
  progress: {
    width: "100%",
    height: 2,
    position: "absolute",
    bottom: 0,
    backgroundColor: "red"
  }
});

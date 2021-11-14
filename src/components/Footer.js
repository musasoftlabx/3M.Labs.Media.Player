import React, { useEffect } from "react";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaVolumeDown,
} from "react-icons/fa";
import {
  MdOutlineVolumeUp,
  MdPlayCircle,
  MdPauseCircle,
  MdPlaylistPlay,
} from "react-icons/md";
import { IoShuffleSharp, IoVolumeHigh } from "react-icons/io5";
import { IoIosRepeat } from "react-icons/io";
import {
  BsDot,
  BsFillSkipBackwardFill,
  BsFillSkipForwardFill,
  BsGrid1X2,
  BsPlayCircleFill,
} from "react-icons/bs";
import Paper from "@mui/material/Paper";
import {
  Avatar,
  BottomNavigationAction,
  Chip,
  Grid,
  ListItem,
  ListItemText,
  Rating,
  Slider,
  Typography,
} from "@mui/material";
import List from "@mui/material/List";
import { useTheme } from "@emotion/react";
import { useState } from "react";
import { styled } from "@material-ui/styles";

import { useRecoilValue } from "recoil";

const Footer = ({
  currentlyPlaying,
  isPlaying,
  setIsPlaying,
  NGINX_SERVER,
  NODE_SERVER,
  serverState,
}) => {
  const theme = useTheme();

  const [position, setPosition] = useState(0);
  const [paused, setPaused] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setRating(currentlyPlaying && currentlyPlaying.rating);
  }, [currentlyPlaying]);

  /* const mainIconColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const lightIconColor =
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"; */
  let audio = document.getElementById("audio");

  const duration = audio && audio.duration; // seconds

  if (audio) audio.ontimeupdate = () => setPosition(audio.currentTime);

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audio.pause();
    } else {
      setIsPlaying(true);
      audio.play();
    }
  };

  const handleRating = (v) => {
    setRating(v);
    fetch(`${NODE_SERVER}rate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: Number(v),
        _id: currentlyPlaying._id,
      }),
    }).then((res) => res.json().then((data) => console.log(data)));
  };

  const formatDuration = (position) => {
    const minute = Math.floor(position / 60);
    const secondLeft = Math.floor(position - minute * 60);
    return `${minute}:${secondLeft < 9 ? `0${secondLeft}` : secondLeft}`;
  };

  const PlayButton = styled(MdPlayCircle)({
    fontSize: 40,
    opacity: 0.9,
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.1)",
    },
  });

  const PauseButton = styled(MdPauseCircle)({
    fontSize: 40,
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.1)",
    },
  });

  const PreviousTrack = styled(BsFillSkipBackwardFill)({
    fontSize: 20,
    opacity: 0.5,
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.1)",
      opacity: 1,
    },
  });

  const NextTrack = styled(BsFillSkipForwardFill)({
    fontSize: 20,
    opacity: 0.5,
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.1)",
      opacity: 1,
    },
  });

  const Shuffle = styled(IoShuffleSharp)({
    fontSize: 20,
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.3)",
      opacity: 1,
    },
  });

  const Repeat = styled(IoIosRepeat)({
    fontSize: 20,
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.3)",
      opacity: 1,
    },
  });

  const Playlist = styled(MdPlaylistPlay)({
    fontSize: 20,
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.3)",
      opacity: 1,
    },
  });

  const VolumeUp = styled(IoVolumeHigh)({
    fontSize: 17,
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.3)",
      opacity: 1,
    },
  });

  const VolumeDown = styled(FaVolumeDown)({
    fontSize: 20,
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.3)",
      opacity: 1,
    },
  });

  const Muted = styled(FaVolumeMute)({
    fontSize: 20,
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.3)",
      opacity: 1,
    },
  });

  const x = useRecoilValue(serverState);
  console.log(x);

  return (
    <div>
      <Paper
        square={true}
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10000 }}
      >
        <Grid container alignItems="center">
          <Grid xs={3} item>
            <List sx={{ mr: 1 }}>
              <ListItem alignItems="center">
                <Avatar
                  alt="Cover Art"
                  src={NGINX_SERVER + currentlyPlaying?.CoverArtURL}
                  variant="rounded"
                  sx={{ width: 45, height: 45, mr: 2, mt: -1 }}
                />

                <ListItemText
                  primary={currentlyPlaying?.title || currentlyPlaying?.name}
                  secondary={
                    <>
                      <Grid container wrap="nowrap">
                        <Grid item xs zeroMinWidth>
                          <Typography
                            sx={{ fontSize: 12 }}
                            variant="body2"
                            color="text.secondary"
                            noWrap
                          >
                            {(currentlyPlaying?.artists &&
                              currentlyPlaying.artists.join(" / ")) ||
                              ""}
                          </Typography>
                          <Rating
                            sx={{ fontSize: 14, mt: 0.4, ml: -0.2 }}
                            precision={0.5}
                            value={rating}
                            onChange={(e) => handleRating(e.target.value)}
                            emptyIcon={<BsDot fontSize="inherit" />}
                          />
                        </Grid>
                      </Grid>
                    </>
                  }
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              spacing={3}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Grid item>
                <PreviousTrack />
              </Grid>
              <Grid item>
                {isPlaying ? (
                  <PauseButton onClick={handlePlay} />
                ) : (
                  <PlayButton onClick={handlePlay} />
                )}
              </Grid>
              <Grid item>
                <NextTrack />
              </Grid>
              <Grid item xs={8}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item sx={{ mb: 1 }}>
                    <Typography variant="caption">
                      {`${
                        audio && audio.duration > 0
                          ? formatDuration(audio.currentTime)
                          : "0:00"
                      }`}
                    </Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Slider
                      aria-label="time-indicator"
                      size="small"
                      value={position}
                      min={0}
                      step={1}
                      max={duration}
                      onChange={(_, value) => setPosition(value)}
                      sx={{
                        /* color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)", */
                        "& .MuiSlider-thumb": {
                          width: 8,
                          height: 8,

                          transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                          "&:before": {
                            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                          },
                          "&:hover, &.Mui-focusVisible": {
                            boxShadow: `0px 0px 0px 8px ${
                              "rgb(255 255 255 / 16%)"
                              /* theme.palette.mode === "dark"
                                                ? "rgb(255 255 255 / 16%)"
                                                : "rgb(0 0 0 / 16%)" */
                            }`,
                          },
                          "&.Mui-active": {
                            width: 20,
                            height: 20,
                          },
                        },
                        "& .MuiSlider-rail": {
                          opacity: 0.28,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item sx={{ mb: 1 }}>
                    <Typography sx={{ color: "white" }} variant="caption">
                      {`${
                        audio && audio.duration > 0
                          ? formatDuration(audio && audio.duration)
                          : "0:00"
                      }`}
                    </Typography>
                    {/* <Chip
                      variant="outlined"
                      color="success"
                      size="small"
                      label={
                        <Typography sx={{ color: "white" }} variant="caption">
                          {`${
                            audio && audio.duration > 0
                              ? formatDuration(audio && audio.duration)
                              : "0:00"
                          }`}
                        </Typography>
                      }
                    /> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            justifyContent="center"
            xs={3}
            children={
              <>
                <Grid
                  container
                  spacing={4}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item>
                    <Shuffle />
                  </Grid>
                  <Grid item>
                    <Repeat />
                  </Grid>
                  <Grid item>
                    <Playlist />
                  </Grid>
                  <Grid item>
                    <VolumeUp />
                  </Grid>
                  <Grid item>
                    <Box sx={{ height: 50 }}>
                      <Slider
                        aria-label="Volume"
                        defaultValue={0}
                        orientation="vertical"
                        size="small"
                        sx={{
                          //color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
                          "& .MuiSlider-track": {
                            border: "none",
                          },
                          "& .MuiSlider-thumb": {
                            width: 10,
                            height: 10,
                            backgroundColor: "#fff",
                            "&:before": {
                              boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                            },
                            "&:hover, &.Mui-focusVisible, &.Mui-active": {
                              boxShadow: "none",
                            },
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </>
            }
          />
        </Grid>
      </Paper>
    </div>
  );
};

export default Footer;

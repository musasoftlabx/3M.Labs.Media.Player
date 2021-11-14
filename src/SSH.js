import React from "react";
import { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { styled } from "@material-ui/styles";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import { MdPauseCircleFilled } from "react-icons/md";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";

const SSH = ({
  setCurrentlyPlaying,
  setLyrics,
  setIsPlaying,
  NGINX_SERVER,
  NODE_SERVER,
}) => {
  const [explorer, setExplorer] = useState([]);
  const [activeDirectory, setActiveDirectory] = useState("/");
  const [prevDir, setPrevDir] = useState("");
  const [file, setFile] = useState(null);
  const [tag, setTag] = useState(null);
  const [streamURL, setstreamURL] = useState("");

  const handlePlay = (file, index) => {
    setFile(file);
    setCurrentlyPlaying(explorer[index]);

    let url = `${NGINX_SERVER}dir/${localStorage.ActiveDirectory}/${file}`;
    var audio = document.getElementById("audio");
    var source = document.getElementById("audioSource");
    source.src = url;
    audio.load(); //call this to just preload the audio without playing
    audio.play(); //call this to play the song right away

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);

    //fetch("http://192.168.100.2:3333/id3", {
    fetch(`${NODE_SERVER}id3`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //uri: encodeURI(`./public/music${localStorage.ActiveDirectory}/${file}`),
        uri: `./public/music${localStorage.ActiveDirectory}/${file}`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTag(data);
        setLyrics(data?.native["ID3v2.3"][11]?.value?.text);
        //console.log(tag);
      });
  };

  const FetchExplorer = (dir) => {
    fetch(`${NODE_SERVER}dir`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        activeDirectory: dir,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setExplorer(data);
        //localStorage.ActiveDirectory = localStorage.ActiveDirectory || "" + dir;
      });
  };

  const handleDirectoryChange = (dir) => {
    localStorage.ActiveDirectory = (localStorage.ActiveDirectory || "") + dir;
    setActiveDirectory(localStorage.ActiveDirectory);
    FetchExplorer(localStorage.ActiveDirectory);
  };

  const handleBackAction = () => {
    let x = localStorage.ActiveDirectory.split("/").pop();
    localStorage.ActiveDirectory = localStorage.ActiveDirectory.replace(
      `/${x}`,
      ""
    );
    FetchExplorer(localStorage.ActiveDirectory);
  };

  useEffect(() => {
    let ActiveDirectory;
    if (localStorage.getItem("ActiveDirectory")) {
      setActiveDirectory(localStorage.getItem("ActiveDirectory"));
      ActiveDirectory = localStorage.getItem("ActiveDirectory");
    } else {
      setActiveDirectory("");
      ActiveDirectory = "";
    }

    FetchExplorer(ActiveDirectory);
  }, []);

  const CoverImage = styled("div")({
    width: 50,
    height: 50,
    objectFit: "cover",
    overflow: "hidden",
    flexShrink: 0,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.08)",
    "& > img": {
      width: "100%",
    },
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.1)",
    },
  });

  const Folder = styled(FcOpenedFolder)({
    fontSize: 60,
    opacity: 0.95,
    marginTop: "10px",
    zIndex: 1,
    "&:hover": {
      cursor: "pointer",
    },
  });

  const File = styled("div")({
    fontSize: 60,
    opacity: 0.9,
    "&:hover": {
      cursor: "pointer",
      transform: "scale(1.1)",
    },
  });

  return (
    <div>
      <button onClick={handleBackAction}>BACK</button>
      <h3>{file}</h3>
      {tag && (
        <img
          src={tag.cover}
          alt="cover"
          style={{ width: "200px", height: "200px" }}
        />
      )}

      <List sx={{ width: "100%", maxWidth: 360 }}>
        {explorer &&
          explorer.map((item, i) => (
            <div key={i}>
              {item.type === "folder" ? (
                <>
                  <ListItem
                    alignItems="center"
                    onClick={() => handleDirectoryChange("/" + item.name)}
                  >
                    <Folder />
                    {item.image && (
                      <img
                        style={{
                          width: "45px",
                          height: "45px",
                          marginLeft: "-34px",
                          marginRight: "10px",
                          marginTop: "-15px",
                          borderRadius: "50%",
                          border: "1px groove #e0e0e0",
                        }}
                        alt="Cover Art"
                        src={NGINX_SERVER + item.image}
                      />
                    )}
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {item.folders > 0 &&
                            (item.folders === 1
                              ? `${item.folders} folder`
                              : `${item.folders} folders`)}
                          {item.folders > 0 && item.files > 0 && " / "}
                          {item.files > 0 &&
                            (item.files === 1
                              ? `${item.files} file`
                              : `${item.files} files`)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              ) : (
                <>
                  <ListItem
                    alignItems="flex-start"
                    onClick={() => handlePlay(item.name, i)}
                    secondaryAction={
                      <Rating
                        defaultValue={item.rating || 0}
                        precision={0.5}
                        size="small"
                      />
                    }
                  >
                    <Paper elevation={24} style={{ marginRight: 10 }}>
                      <CoverImage>
                        <img
                          alt="Cover Art"
                          src={NGINX_SERVER + item.CoverArtURL}
                        />
                      </CoverImage>
                    </Paper>

                    <ListItemText
                      primary={item.title || item.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {(item.artists && item.artists.join(" / ")) || ""}
                          </Typography>
                          {item.album ? ` — ${item.album}` : " — "}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              )}
            </div>
          ))}
      </List>

      <audio id="audio" controls>
        <source id="audioSource" src="" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default SSH;

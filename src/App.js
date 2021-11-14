import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LyricsDialog from "./components/LyricsDialog";
import SSH from "./SSH";
import NavigationDrawer from "./components/NavigationDrawer";

import { atom, useRecoilState } from "recoil";

const serverState = atom({
  key: "serverState", // unique ID (with respect to other atoms/selectors)
  default: {
    NGINX_SERVER: "http://musasoft.ddns.net:8080/",
    NODE_SERVER: "http://musasoft.ddns.net:3000/",
  },
});

//const NODE_SERVER = "http://192.168.100.2:3000/";
const NODE_SERVER = "http://musasoft.ddns.net:3000/";
//const NGINX_SERVER = "http://192.168.100.2:8080/";
const NGINX_SERVER = "http://musasoft.ddns.net:8080/";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "Rubik",
  },
});

const drawerWidth = 240;

function App() {
  //const [server, setServer] = useRecoilState(serverState);

  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [lyrics, setLyrics] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <NavigationDrawer drawerWidth={drawerWidth} />
        <Header drawerWidth={drawerWidth} />

        <SSH
          setCurrentlyPlaying={setCurrentlyPlaying}
          setIsPlaying={setIsPlaying}
          setLyrics={setLyrics}
          NGINX_SERVER={NGINX_SERVER}
          NODE_SERVER={NODE_SERVER}
        />
        <LyricsDialog lyrics={lyrics} />
        <Footer
          currentlyPlaying={currentlyPlaying}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          NGINX_SERVER={NGINX_SERVER}
          NODE_SERVER={NODE_SERVER}
          serverState={serverState}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;

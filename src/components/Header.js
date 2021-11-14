import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";

const Header = ({ drawerWidth }) => {
  const [artists, setArtists] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        //backgroundColor: "primary.dark",
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 400 }}>
        Now Playing
      </Typography>
      <Grid container spacing={3}>
        {artists.map((item, index) => (
          <Grid item xs={2}>
            <Avatar
              variant="rounded"
              sx={{ width: 100, height: 100 }}
              src="https://s3.amazonaws.com/creativetim_bucket/products/80/thumb/opt_mdp_react_thumbnail.jpg?1522160852"
            />
            <Typography variant="body2" sx={{ fontWeight: 400 }}>
              Now Playing
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Header;

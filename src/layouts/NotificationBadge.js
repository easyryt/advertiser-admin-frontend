import { styled } from "@mui/material";
import Badge from "@mui/material/Badge";

const NotificationBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -4,
    top: 8,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    fontWeight: 600,
  },
}));

export default NotificationBadge;

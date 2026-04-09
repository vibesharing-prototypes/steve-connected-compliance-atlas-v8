import { Box, Stack } from "@mui/material";
import { PropsWithChildren } from "react";

interface PageLayoutProps {
  fullWidth?: boolean;
}

export default function PageLayout({ children, fullWidth }: PropsWithChildren<PageLayoutProps>) {
  return (
    <Box sx={{ px: 3, py: 2, width: '100%' }}>
      <Box sx={fullWidth ? {} : { maxWidth: 800, mx: 'auto', width: '100%' }}>
        <Stack gap={3}>{children}</Stack>
      </Box>
    </Box>
  );
}

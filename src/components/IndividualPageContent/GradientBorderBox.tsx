import {Box, BoxProps} from "@mui/material";
import React from "react";

interface GradientBorderBoxProps extends BoxProps {
  children: React.ReactNode;
}

interface TableGradientBorderBoxProps extends BoxProps {
  width?: string | number;
  mobileWidth?: string | number;
  marginTop?: string | number;
  children: React.ReactNode;
}
export default function GradientBorderBox({
  children,
  ...props
}: GradientBorderBoxProps) {
  return (
    <Box
      sx={{
        marginTop: 4,
        position: "relative",
        "& > .MuiBox-root": {
          borderRadius: "16px",
          overflow: "hidden",
          background:
            "linear-gradient(90deg, rgba(32, 31, 28, 0.98), rgba(45, 43, 36, 0.95))",
          margin: "1px",
        },
        "& .MuiGrid2-container": {
          marginTop: "2.5px !important",
          marginBottom: "2.5px !important",
          padding: "16px 32px !important",
        },
        "& .MuiGrid2-direction-xs-row": {
          paddingTop: "2.5px !important",
          paddingBottom: "2.5px !important",
        },
        "& > .MuiBox-root > .MuiStack-root > .MuiBox-root": {
          marginBottom: "2.5px !important",
          marginTop: "2.5px !important",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: "16px",
          padding: "1px",
          background:
            "linear-gradient(90deg, #FFDA34 0%, rgba(255, 218, 52, 0) 49%, #FFDA34 100%)",
          maskImage:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          pointerEvents: "none",
          zIndex: 1,
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export function TableGradientBorderBox({
  children,
  width = "86%",
  mobileWidth = "81%",
  marginTop = 0,
  ...props
}: TableGradientBorderBoxProps) {
  return (
    <Box
      sx={{
        position: "relative",
        margin: "0 auto",
        marginTop: marginTop,
        width: width,
        "@media (max-width: 768px)": {
          overflowX: "hidden",
          width: mobileWidth,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: "16px",
          padding: "1px",
          background:
            "linear-gradient(90deg, #FFDA34 0%, rgba(255, 218, 52, 0) 49%, #FFDA34 100%)",
          maskImage:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          pointerEvents: "none",
        },
        "& .scroll-container": {
          position: "relative",
          width: "100%",
          overflowX: "auto",
          borderRadius: "16px",
          padding: "1px",
          overscrollBehaviorX: "none",
          "@media (max-width: 768px)": {
            maxWidth: "100vw",
          },
          "& > *": {
            paddingLeft: "16px",
            paddingRight: "16px",
          },
        },
        ...props.sx,
      }}
      {...props}
    >
      <div className="scroll-container">{children}</div>
    </Box>
  );
}

import React from "react";
import Box from "@mui/material/Box";
import {useSearchParams} from "react-router-dom";
import {Button} from "@mui/material";

export function maxStart(maxVersion: number, limit: number) {
  return Math.max(0, 1 + maxVersion - limit);
}

export function RenderPagination({
  start,
  limit,
  maxVersion,
}: {
  start: number;
  limit: number;
  maxVersion: number;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const numPages = Math.ceil(maxVersion / limit);
  const progress = 1 - (start + limit - 1) / maxVersion;
  const currentPage = 1 + Math.floor(progress * numPages);

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newPageNum: number,
  ) => {
    const delta = (currentPage - newPageNum) * limit;
    const newStart = Math.max(
      0,
      Math.min(maxStart(maxVersion, limit), start + delta),
    );
    searchParams.set("start", newStart.toString());
    setSearchParams(searchParams);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(numPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={(e) => handleChange(e, i)}
          sx={{
            minWidth: "auto",
            px: 1.5,
            mx: 0.5,
            color: "#FFD700",
            backgroundColor: "transparent",
            border: "none",
            borderBottom: currentPage === i ? "2px solid #FFD700" : "none",
            borderRadius: 0,
            fontWeight: currentPage === i ? "bold" : "normal",
            "&:hover": {
              backgroundColor: "transparent",
              opacity: 0.8,
            },
          }}
        >
          {i}
        </Button>,
      );
    }

    if (endPage < numPages) {
      pageNumbers.push(
        <Box key="ellipsis" component="span" sx={{color: "#FFD700", px: 1}}>
          ...
        </Box>,
      );
    }

    return pageNumbers;
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 3,
      }}
    >
      <Button
        onClick={(e) => handleChange(e, currentPage - 1)}
        disabled={currentPage === 1}
        sx={{
          px: 2,
          py: 0.5,
          backgroundColor: "#FFD700",
          color: "black",
          fontWeight: "bold",
          opacity: currentPage === 1 ? 0.5 : 1,
          mr: 1,
          "&:hover": {
            backgroundColor: "#FFD700",
            opacity: currentPage === 1 ? 0.5 : 0.8,
          },
          "&.Mui-disabled": {
            backgroundColor: "#FFD700",
            color: "black",
          },
        }}
      >
        PREV
      </Button>

      {renderPageNumbers()}

      <Button
        onClick={(e) => handleChange(e, currentPage + 1)}
        disabled={currentPage === numPages}
        sx={{
          px: 2,
          py: 0.5,
          backgroundColor: "#FFD700",
          color: "black",
          fontWeight: "bold",
          opacity: currentPage === numPages ? 0.5 : 1,
          ml: 1,
          "&:hover": {
            backgroundColor: "#FFD700",
            opacity: currentPage === numPages ? 0.5 : 0.8,
          },
          "&.Mui-disabled": {
            backgroundColor: "#FFD700",
            color: "black",
          },
        }}
      >
        NEXT
      </Button>
    </Box>
  );
}

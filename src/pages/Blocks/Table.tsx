import * as React from "react";
import {Box, Table, TableHead, TableRow} from "@mui/material";
import GeneralTableRow from "../../components/Table/GeneralTableRow";
import GeneralTableHeaderCell from "../../components/Table/GeneralTableHeaderCell";
import {assertNever} from "../../utils";
import HashButton, {HashType} from "../../components/HashButton";
import {Types} from "aptos";
import {parseTimestamp} from "../utils";
import moment from "moment";
import GeneralTableBody from "../../components/Table/GeneralTableBody";
import GeneralTableCell from "../../components/Table/GeneralTableCell";
import {Link, useAugmentToWithGlobalSearchParams} from "../../routing";
import {TableGradientBorderBox} from "../../components/IndividualPageContent/GradientBorderBox";

function getAgeInSeconds(block: Types.Block): string {
  const blockTimestamp = parseTimestamp(block.block_timestamp);
  const nowTimestamp = parseTimestamp(moment.now().toString());
  const duration = moment.duration(nowTimestamp.diff(blockTimestamp));
  const durationInSec = duration.asSeconds().toFixed(0);
  return durationInSec;
}

type BlockCellProps = {
  block: Types.Block;
};

function BlockHeightCell({block}: BlockCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "left"}}>
      <Link
        to={`/block/${block.block_height}`}
        target="_blank"
        underline="none"
      >
        {block.block_height}
      </Link>
    </GeneralTableCell>
  );
}

function BlockAgeCell({block}: BlockCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "left"}}>
      {`${getAgeInSeconds(block)}s ago`}
    </GeneralTableCell>
  );
}

function BlockHashCell({block}: BlockCellProps) {
  return (
    <GeneralTableCell sx={{}}>
      <HashButton
        hash={block.block_hash}
        type={HashType.OTHERS}
        sx={{
          color: "#FFDA34",

          "& .MuiButton-root": {
            backgroundColor: "#000000",
          },
        }}
      />
    </GeneralTableCell>
  );
}

function FirstVersionCell({block}: BlockCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "right"}}>
      <Link to={`/txn/${block.first_version}`} target="_blank" underline="none">
        {block.first_version}
      </Link>
    </GeneralTableCell>
  );
}

function LastVersionCell({block}: BlockCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "right"}}>
      <Link to={`/txn/${block.last_version}`} target="_blank" underline="none">
        {block.last_version}
      </Link>
    </GeneralTableCell>
  );
}

const BlockCells = Object.freeze({
  height: BlockHeightCell,
  age: BlockAgeCell,
  hash: BlockHashCell,
  firstVersion: FirstVersionCell,
  lastVersion: LastVersionCell,
});

type Column = keyof typeof BlockCells;

const DEFAULT_COLUMNS: Column[] = [
  "height",
  "age",
  "hash",
  "firstVersion",
  "lastVersion",
];

type BlockRowProps = {
  block: Types.Block;
  columns: Column[];
};

function BlockRow({block, columns}: BlockRowProps) {
  const augmentTo = useAugmentToWithGlobalSearchParams();

  return (
    <GeneralTableRow to={augmentTo(`/block/${block.block_height}`)}>
      {columns.map((column) => {
        const Cell = BlockCells[column];
        return <Cell key={column} block={block} />;
      })}
    </GeneralTableRow>
  );
}

type BlockHeaderCellProps = {
  column: Column;
};

function BlockHeaderCell({column}: BlockHeaderCellProps) {
  switch (column) {
    case "height":
      return <GeneralTableHeaderCell header="Block" />;
    case "age":
      return <GeneralTableHeaderCell header="Age" />;
    case "hash":
      return <GeneralTableHeaderCell header="Hash" />;
    case "firstVersion":
      return <GeneralTableHeaderCell header="First Version" textAlignRight />;
    case "lastVersion":
      return <GeneralTableHeaderCell header="Last Version" textAlignRight />;
    default:
      return assertNever(column);
  }
}

type BlocksTableProps = {
  blocks: Types.Block[];
  columns?: Column[];
};

export default function BlocksTable({
  blocks,
  columns = DEFAULT_COLUMNS,
}: BlocksTableProps) {
  return (
    <TableGradientBorderBox mobileWidth="86%">
      <Box
        sx={{
          margin: "0 auto",
          overflowX: "auto",
          padding: "1px",
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 218, 52, 0.3)",
            borderRadius: "3px",
          },
        }}
      >
        <Table
          sx={{
            // tableLayout: "fixed",
            "& th:nth-of-type(2), & td:nth-of-type(2)": {
              width: "30%",
            },
            "& td, & th": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              padding: "12px 16px",
            },
            // Desktop styles
            "@media (min-width: 769px)": {
              "& th:nth-of-type(2)": {
                width: "60px",
                minWidth: "60px",
                maxWidth: "60px",
              },
              "& th:nth-of-type(6)": {
                width: "30%",
              },
            },
            "@media (max-width: 768px)": {
              tableLayout: "auto",
              "& td, & th": {
                fontSize: "0.875rem",
              },
            },
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <BlockHeaderCell key={column} column={column} />
              ))}
            </TableRow>
          </TableHead>
          <GeneralTableBody>
            {blocks.map((block: any, i: number) => {
              return <BlockRow key={i} block={block} columns={columns} />;
            })}
          </GeneralTableBody>
        </Table>
      </Box>
    </TableGradientBorderBox>
  );
}

import * as React from "react";
import {Box, Stack, Typography} from "@mui/material";
import Table from "@mui/material/Table";
import {Types} from "aptos";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import GeneralTableRow from "../../../components/Table/GeneralTableRow";
import GeneralTableHeaderCell from "../../../components/Table/GeneralTableHeaderCell";
import GeneralTableCell from "../../../components/Table/GeneralTableCell";
import HashButton, {HashType} from "../../../components/HashButton";
// import {Link} from "../../../routing";
import GeneralTableBody from "../../../components/Table/GeneralTableBody";
import {TableGradientBorderBox} from "../../../components/IndividualPageContent/GradientBorderBox";
import {TableTransactionStatus} from "../../../components/TransactionStatus";
import {Link} from "../../../routing";
import {TableTransactionType} from "../../../components/TransactionType";
import {getTableFormattedTimestamp} from "../../utils";
import {
  getCoinBalanceChangeForAccount,
  getTransactionAmount,
  getTransactionCounterparty,
} from "../../Transaction/utils";
import TransactionFunction from "../../Transaction/Tabs/Components/TransactionFunction";
import {
  aptosColor,
  grey,
  negativeColor,
} from "../../../themes/colors/aptosColorPalette";
import {APTCurrencyValue} from "../../../components/IndividualPageContent/ContentValue/CurrencyValue";
import TransactionTypeTooltip from "../../Transactions/Components/TransactionTypeTooltip";
import {assertNever} from "../../../utils";
import GasFeeValue from "../../../components/IndividualPageContent/ContentValue/GasFeeValue";

type BlockTransactionCellProps = {
  transaction: Types.Transaction;
  address?: string;
};

function TransactionVersionStatusCell({
  transaction,
}: BlockTransactionCellProps) {
  return (
    <GeneralTableCell sx={{textAlign: "left"}}>
      <Stack direction="row" spacing={0.5}>
        <Link
          to={`/txn/${"version" in transaction && transaction.version}`}
          color="primary"
          underline="none"
        >
          {"version" in transaction && transaction.version}
        </Link>
        {"success" in transaction && (
          <TableTransactionStatus success={transaction.success} />
        )}
      </Stack>
    </GeneralTableCell>
  );
}

function TransactionTypeCell({transaction}: BlockTransactionCellProps) {
  return (
    <GeneralTableCell>
      {<TableTransactionType type={transaction.type} />}
    </GeneralTableCell>
  );
}

function TransactionTimestampCell({transaction}: BlockTransactionCellProps) {
  const timestamp =
    "timestamp" in transaction ? (
      getTableFormattedTimestamp(transaction.timestamp)
    ) : (
      // Genesis transaction
      <Typography variant="subtitle2" align="center">
        -
      </Typography>
    );

  return <GeneralTableCell>{timestamp}</GeneralTableCell>;
}

function TransactionSenderCell({transaction}: BlockTransactionCellProps) {
  let sender;
  if (transaction.type === "user_transaction") {
    sender = (transaction as Types.UserTransaction).sender;
  } else if (transaction.type === "block_metadata_transaction") {
    sender = (transaction as Types.BlockMetadataTransaction).proposer;
  }

  return (
    <GeneralTableCell
      sx={{
        "& a": {color: "#FFDA34"},
      }}
    >
      {sender && <HashButton hash={sender} type={HashType.ACCOUNT} />}
    </GeneralTableCell>
  );
}

function TransactionReceiverOrCounterPartyCell({
  transaction,
}: BlockTransactionCellProps) {
  const counterparty = getTransactionCounterparty(transaction);
  return (
    <GeneralTableCell
      sx={{
        "& a": {color: "#FFDA34"},
      }}
    >
      {counterparty && (
        <HashButton hash={counterparty.address} type={HashType.ACCOUNT} />
      )}
    </GeneralTableCell>
  );
}

function TransactionFunctionCell({transaction}: BlockTransactionCellProps) {
  return (
    <GeneralTableCell
      sx={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      <TransactionFunction
        transaction={transaction}
        sx={{maxWidth: {xs: 200, md: 300, lg: 400, color: "#FFDA34"}}}
      />
    </GeneralTableCell>
  );
}

function TransactionAmount({
  transaction,
  address,
}: {
  transaction: Types.Transaction;
  address?: string;
}) {
  const isAccountTransactionTable = typeof address === "string";

  if (isAccountTransactionTable) {
    const amount = getCoinBalanceChangeForAccount(transaction, address);
    if (amount !== undefined) {
      let amountAbs = amount;
      let color = undefined;
      if (amount > 0) {
        color = aptosColor;
      } else if (amount < 0) {
        color = negativeColor;
        amountAbs = -amount;
      }

      return (
        <Box sx={{color: color}}>
          {amount > 0 && <>+</>}
          {amount < 0 && <>-</>}
          <APTCurrencyValue amount={amountAbs.toString()} />
        </Box>
      );
    }
  } else {
    const amount = getTransactionAmount(transaction);
    if (amount !== undefined) {
      return (
        <Box>
          <APTCurrencyValue amount={amount.toString()} />
        </Box>
      );
    }
  }

  return null;
}

function TransactionAmountGasCell({
  transaction,
  address,
}: BlockTransactionCellProps) {
  return (
    <GeneralTableCell sx={{paddingY: 1}}>
      <Stack sx={{textAlign: "right"}}>
        <TransactionAmount transaction={transaction} address={address} />
        <Box sx={{fontSize: 11, color: grey[450]}}>
          {"gas_used" in transaction && "gas_unit_price" in transaction ? (
            <>
              <>Gas </>
              <GasFeeValue
                gasUsed={transaction.gas_used}
                gasUnitPrice={transaction.gas_unit_price}
              />
            </>
          ) : null}
        </Box>
      </Stack>
    </GeneralTableCell>
  );
}

const BlockTransactionCells = Object.freeze({
  versionStatus: TransactionVersionStatusCell,
  type: TransactionTypeCell,
  timestamp: TransactionTimestampCell,
  sender: TransactionSenderCell,
  receiverOrCounterParty: TransactionReceiverOrCounterPartyCell,
  function: TransactionFunctionCell,
  amountGas: TransactionAmountGasCell,
});

type BlockTransactionColumn = keyof typeof BlockTransactionCells;

const DEFAULT_COLUMNS: BlockTransactionColumn[] = [
  "versionStatus",
  "type",
  "timestamp",
  "sender",
  "receiverOrCounterParty",
  "function",
  "amountGas",
];

type BlockTransactionHeaderCellProps = {
  column: BlockTransactionColumn;
};

function BlockTransactionHeaderCell({column}: BlockTransactionHeaderCellProps) {
  switch (column) {
    case "versionStatus":
      return <GeneralTableHeaderCell header="Version" />;
    case "type":
      return (
        <GeneralTableHeaderCell
          header="Type"
          tooltip={<TransactionTypeTooltip />}
          sx={{textAlign: "center"}}
        />
      );
    case "timestamp":
      return <GeneralTableHeaderCell header="Timestamp" />;
    case "sender":
      return <GeneralTableHeaderCell header="Sender" />;
    case "receiverOrCounterParty":
      return <GeneralTableHeaderCell header="Sent To" />;
    case "function":
      return <GeneralTableHeaderCell header="Function" />;
    case "amountGas":
      return <GeneralTableHeaderCell header="Amount" textAlignRight />;
    default:
      return assertNever(column);
  }
}

type BlockTransactionRowProps = {
  transaction: Types.Transaction;
  columns: BlockTransactionColumn[];
};

function BlockTransactionRow({transaction, columns}: BlockTransactionRowProps) {
  return (
    <GeneralTableRow>
      {columns.map((column) => {
        const Cell = BlockTransactionCells[column];
        return <Cell key={column} transaction={transaction} />;
      })}
    </GeneralTableRow>
  );
}

type BlockTransactionsTableProps = {
  transactions: Types.Transaction[];
  columns?: BlockTransactionColumn[];
};

export default function BlockTransactionsTable({
  transactions,
  columns = DEFAULT_COLUMNS,
}: BlockTransactionsTableProps) {
  return (
    <TableGradientBorderBox width="100%" marginTop={4} mobileWidth="93%">
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
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <BlockTransactionHeaderCell key={column} column={column} />
              ))}
            </TableRow>
          </TableHead>
          <GeneralTableBody>
            {transactions.map((transaction, i) => {
              return (
                <BlockTransactionRow
                  key={`${i}-${transaction.hash}`}
                  transaction={transaction}
                  columns={columns}
                />
              );
            })}
          </GeneralTableBody>
          {/* <TableFooter>
            <TablePagination
            // currentPage={currentPage}
            // totalPages={totalPages}
            // onPageChange={setCurrentPage}
            />
          </TableFooter> */}
        </Table>
      </Box>
    </TableGradientBorderBox>
  );
}

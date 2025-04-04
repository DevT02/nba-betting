"use client";

import React, { useState, useEffect } from "react";
import { OddsRow } from "@/types/game"; 
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getCasinoLogo } from "@/lib/casinoLogoMap";
import { ChevronUp, ChevronDown } from "lucide-react";

type OddsTableProps = {
  oddsData: OddsRow[];
  isMobileView?: boolean;
};

type SortColumn = "book" | "moneyline" | "probability" | "edge";
type SortDirection = "asc" | "desc";

const OddsTable = ({ oddsData, isMobileView = false }: OddsTableProps) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>("edge");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [sortedData, setSortedData] = useState<OddsRow[]>([]);

  const bestEdgeRow = React.useMemo(() => {
    if (!sortedData?.length) return null;
    return [...sortedData].sort((a, b) => parseFloat(b.edge) - parseFloat(a.edge))[0];
  }, [sortedData]);

  const compareValues = (a: OddsRow, b: OddsRow, column: SortColumn, direction: SortDirection): number => {
    let valueA, valueB;
    let comparison = 0;

    switch (column) {
      case "book":
        valueA = a.book.toLowerCase();
        valueB = b.book.toLowerCase();
        comparison = valueA.localeCompare(valueB);
        break;
      case "moneyline":
        valueA = parseInt(a.moneyline, 10);
        valueB = parseInt(b.moneyline, 10);
        comparison = valueA - valueB;
        break;
      case "probability":
        valueA = parseFloat(a.probability.replace("%", ""));
        valueB = parseFloat(b.probability.replace("%", ""));
        comparison = valueA - valueB;
        break;
      case "edge":
        valueA = parseFloat(a.edge);
        valueB = parseFloat(b.edge);
        comparison = valueA - valueB;
        break;
    }
    return direction === "asc" ? comparison : -comparison;
  };

  useEffect(() => {
    if (!oddsData) {
      setSortedData([]);
      return;
    }

    const dataToSort = [...oddsData];
    const sorted = dataToSort.sort((a, b) => {
      const primaryComparison = compareValues(a, b, sortColumn, sortDirection);
      if (primaryComparison === 0) {
        if (sortColumn !== "edge") {
          return compareValues(a, b, "edge", "desc");
        }
        return compareValues(a, b, "probability", "desc");
      }
      return primaryComparison;
    });

    setSortedData(sorted);
  }, [oddsData, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection(column === "edge" || column === "probability" ? "desc" : "asc");
    }
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return null;

    return sortDirection === "asc" ? (
      <ChevronUp className="inline h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="inline h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="mt-6 overflow-hidden border border-border/30 rounded-lg bg-card/80 shadow-sm">
      <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50 pointer-events-none"></div>
        <Table className="w-full text-sm max-[419px]:text-xs">
          <TableHeader className="sticky top-0 z-10 bg-gradient-to-r from-background to-primary/5">
            <TableRow className="border-b border-border bg-card hover:bg-card">
              <TableHead
                className="min-w-[70px] max-[419px]:min-w-[60px] sm:w-1/4 font-medium text-foreground cursor-pointer relative group transition-colors max-[419px]:py-2 max-[419px]:px-2"
                onClick={() => handleSort("book")}
              >
                <span className={`${sortColumn === "book" ? "text-primary" : ""}`}>
                  <span className="sm:inline">Casino</span> {renderSortIcon("book")}
                </span>
              </TableHead>
              <TableHead
                className="min-w-[60px] max-[419px]:min-w-[50px] sm:w-1/4 font-medium text-foreground cursor-pointer relative group transition-colors max-[419px]:py-2 max-[419px]:px-2"
                onClick={() => handleSort("moneyline")}
              >
                <span className={`${sortColumn === "moneyline" ? "text-primary" : ""}`}>
                  <span className="hidden sm:inline">Money</span>
                  <span className="sm:hidden">ML</span>
                  {renderSortIcon("moneyline")}
                </span>
              </TableHead>
              <TableHead
                className="min-w-[60px] max-[419px]:min-w-[50px] sm:w-1/4 font-medium text-foreground cursor-pointer relative group transition-colors max-[419px]:py-2 max-[419px]:px-2"
                onClick={() => handleSort("probability")}
              >
                <span className={`${sortColumn === "probability" ? "text-primary" : ""}`}>
                  <span className="hidden sm:inline">Win Probability</span>
                  <span className="sm:hidden">Win %</span>
                  {renderSortIcon("probability")}
                </span>
              </TableHead>
              <TableHead
                className="min-w-[60px] max-[419px]:min-w-[50px] sm:w-1/4 font-medium text-foreground cursor-pointer relative group transition-colors max-[419px]:py-2 max-[419px]:px-2"
                onClick={() => handleSort("edge")}
              >
                <span className={`${sortColumn === "edge" ? "text-primary" : ""}`}>
                  Edge {renderSortIcon("edge")}
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData && sortedData.length > 0 ? (
              sortedData.map((row, idx) => {
                const edgeValue = parseFloat(row.edge);
                const edgeColorClass =
                  edgeValue > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : edgeValue < 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-muted-foreground";
                const isBest = bestEdgeRow && row.book === bestEdgeRow.book;
                
                return (
                  <TableRow
                    key={idx}
                    className={`border-b border-border last:border-0 hover:bg-muted/30 transition-all duration-200 ${
                      edgeValue > 3 ? "bg-emerald-50/30 dark:bg-emerald-950/10" : ""
                    } ${isBest ? "bg-amber-50/20 dark:bg-amber-950/10" : ""}`}
                    style={{
                      animationDelay: `${idx * 50}ms`,
                      animationName: "fadeIn",
                      animationDuration: "400ms",
                      animationFillMode: "both",
                      opacity: 0,
                      transform: "translateY(0)",
                    }}
                  >
                    <TableCell className="py-3 max-[419px]:py-2 max-[419px]:px-2 font-medium">
                      <div className="flex items-center gap-1 sm:gap-3">
                        <div className="hidden sm:flex relative w-8 h-8 items-center justify-center bg-card border border-border/50 rounded-md overflow-hidden shadow-sm flex-shrink-0">
                          <img
                            src={getCasinoLogo(row.book)}
                            alt={`${row.book} logo`}
                            className="max-w-full max-h-full object-contain p-1"
                            onError={(e) => {
                              e.currentTarget.src = "/images/casinos/generic-casino.svg";
                            }}
                          />
                        </div>
                        <span className="text-sm max-[419px]:text-xs font-medium truncate max-w-[60px] md:max-w-none">
                          {row.book}
                          {isBest && <span className="max-[419px]:inline sm:hidden text-amber-500 ml-1">★</span>}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 max-[419px]:py-2 max-[419px]:px-2 font-medium">{row.moneyline}</TableCell>
                    <TableCell className="py-3 max-[419px]:py-2 max-[419px]:px-2 font-medium">{row.probability}</TableCell>
                    <TableCell className={`py-3 max-[419px]:py-2 max-[419px]:px-2 font-medium ${edgeColorClass}`}>
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-5 h-5 max-[419px]:w-4 max-[419px]:h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/30 mr-2 max-[419px]:mr-1">
                          {edgeValue > 0 ? (
                            <span className="text-emerald-500 dark:text-emerald-400 text-xs">↑</span>
                          ) : edgeValue < 0 ? (
                            <span className="text-rose-500 dark:text-rose-400 text-xs">↓</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">–</span>
                          )}
                        </div>
                        <span>{row.edge}</span>
                        {isBest && (
                          <span className="ml-2 hidden sm:inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-800 dark:text-amber-300">
                            Best
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No odds data available for this selection.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

};

export default OddsTable;

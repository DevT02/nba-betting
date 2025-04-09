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
import { InfoTooltip, TooltipProvider } from "@/components/utils/ToolTipComponent";

type OddsTableProps = {
  oddsData: OddsRow[];
  isMobileView?: boolean;
};

export type SortColumn = "book" | "moneyline" | "edge" | "kelly";
export type SortDirection = "asc" | "desc";

const OddsTable = ({ oddsData, isMobileView = false }: OddsTableProps) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>("edge");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [sortedData, setSortedData] = useState<OddsRow[]>([]);

  // Compute best row based on edge value (this determines which row gets the "Best" badge). I think 
  // im probably going to want to change this..
  const bestRow = React.useMemo(() => {
    if (!sortedData?.length) return null;
    return [...sortedData].sort((a, b) => parseFloat(b.edge) - parseFloat(a.edge))[0];
  }, [sortedData]);

  const compareValues = (
    a: OddsRow,
    b: OddsRow,
    column: SortColumn,
    direction: SortDirection
  ): number => {
    let valueA, valueB, comparison = 0;
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
      case "edge":
        valueA = parseFloat(a.edge);
        valueB = parseFloat(b.edge);
        comparison = valueA - valueB;
        break;
      case "kelly":
        valueA = parseFloat(a.kelly);
        valueB = parseFloat(b.kelly);
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
    dataToSort.sort((a, b) => {
      const primaryComparison = compareValues(a, b, sortColumn, sortDirection);
      if (primaryComparison === 0) {
        // If primary columns tie, fallback to edge descending.
        return compareValues(a, b, "edge", "desc");
      }
      return primaryComparison;
    });
    setSortedData(dataToSort);
  }, [oddsData, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      // For numerical fields default to descending, otherwise ascending.
      setSortDirection(column === "edge" || column === "kelly" ? "desc" : "asc");
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

  // For coloring numeric values (Edge and Kelly)
  const edgeColorClass = (value: number) =>
    value > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : value < 0
      ? "text-rose-600 dark:text-rose-400"
      : "text-muted-foreground";

  const kellyColorClass = (value: number) =>
    value > 0
      ? "text-emerald-600 dark:text-emerald-400"
      : value < 0
      ? "text-rose-600 dark:text-rose-400"
      : "text-muted-foreground";

  return (
    <div className="mt-6 overflow-hidden border border-border/30 rounded-lg bg-card/80 shadow-sm">
      <div className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50 pointer-events-none"></div>
        <Table className="w-full text-sm max-[419px]:text-xs">
          <TableHeader className="sticky top-0 z-10 bg-gradient-to-r from-background to-primary/5">
            <TableRow className="border-b border-border bg-card hover:bg-card">
              {/* Casino column */}
              <TableHead
                className="min-w-[70px] max-[419px]:min-w-[60px] sm:w-1/4 font-medium text-foreground cursor-pointer relative transition-colors max-[419px]:py-2 max-[419px]:px-2 py-3 px-3"
                onClick={() => handleSort("book")}
              >
                <div className="flex items-center">
                  <span className={`${sortColumn === "book" ? "text-primary" : ""}`}>
                    <span className="sm:inline">Casino</span>
                    <span className="ml-1">{renderSortIcon("book")}</span>
                  </span>
                  <div className="ml-1.5">
                    <TooltipProvider>
                      <InfoTooltip
                        text="This column shows the casino providing the odds."
                        isMobile={isMobileView}
                      />
                    </TooltipProvider>
                  </div>
                </div>
              </TableHead>

              {/* Moneyline column */}
              <TableHead
                className="min-w-[60px] max-[419px]:min-w-[50px] sm:w-1/4 font-medium text-foreground cursor-pointer relative transition-colors max-[419px]:py-2 max-[419px]:px-2 py-3 px-3"
                onClick={() => handleSort("moneyline")}
              >
                <div className="flex items-center">
                  <span className={`${sortColumn === "moneyline" ? "text-primary" : ""}`}>
                    <span className="hidden sm:inline">Moneyline</span>
                    <span className="sm:hidden">ML</span>
                    <span className="ml-1">{renderSortIcon("moneyline")}</span>
                  </span>
                  <div className="ml-1.5">
                    <TooltipProvider>
                      <InfoTooltip
                        text={
                          <div className="space-y-2">
                            <p>Moneyline shows potential profit:</p>
                            <p>+150 → bet $100, win $150.</p>
                            <p>-200 → bet $200 to win $100.</p>
                          </div>
                        }
                        isMobile={isMobileView}
                      />
                    </TooltipProvider>
                  </div>
                </div>
              </TableHead>

              {/* Edge column */}
              <TableHead
                className="min-w-[60px] max-[419px]:min-w-[50px] sm:w-1/4 font-medium text-foreground cursor-pointer relative transition-colors max-[419px]:py-2 max-[419px]:px-2 py-3 px-3"
                onClick={() => handleSort("edge")}
              >
                <div className="flex items-center">
                  <span className={`${sortColumn === "edge" ? "text-primary" : ""}`}>
                    Edge
                    <span className="ml-1">{renderSortIcon("edge")}</span>
                  </span>
                  <div className="ml-1.5">
                    <TooltipProvider>
                      <InfoTooltip
                        text={
                          <div className="space-y-2">
                              <p>Edge represents the estimated percentage advantage compared to fair market value.</p>
                              <p>Higher positive values indicate better betting opportunities.</p>
                          </div>
                        }
                        isMobile={isMobileView}
                      />
                    </TooltipProvider>
                  </div>
                </div>
              </TableHead>

              {/* Bankroll column */}
              <TableHead
                className="min-w-[60px] max-[419px]:min-w-[50px] sm:w-1/4 font-medium text-foreground cursor-pointer relative transition-colors max-[419px]:py-2 max-[419px]:px-2 py-3 px-3"
                onClick={() => handleSort("kelly")}
              >
                <div className="flex items-center">
                  <span className={`${sortColumn === "kelly" ? "text-primary" : ""}`}>
                    Bankroll
                    <span className="ml-1">{renderSortIcon("kelly")}</span>
                  </span>
                  <div className="ml-1.5">
                    <TooltipProvider>
                      <InfoTooltip
                        text={
                          <div className="space-y-2">
                            <p>Bankroll percentage (Kelly criterion) shows the optimal fraction of your bankroll to wager.</p>
                            <p>Positive values indicate potential value; negative values suggest avoiding the bet.</p>
                            <p>Long-term, following the kelly criterion yields the best results.</p>
                          </div>
                        }
                        isMobile={isMobileView}
                      />
                    </TooltipProvider>
                  </div>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData && sortedData.length > 0 ? (
              sortedData.map((row, idx) => {
                const edgeVal = parseFloat(row.edge);
                const kellyVal = parseFloat(row.kelly);
                const isBest = bestRow && row.book === bestRow.book;
                
                return (
                  <TableRow
                    key={idx}
                    className={`border-b border-border last:border-0 hover:bg-muted/30 transition-all duration-200 ${
                      edgeVal > 3 ? "bg-emerald-50/30 dark:bg-emerald-950/10" : ""
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
                    {/* Casino cell with Best badge */}
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
                        </span>
                        {isBest && (
                          <span className="ml-1 inline-flex items-center px-1 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">
                            Best
                          </span>
                        )}
                      </div>
                    </TableCell>
                    {/* Money cell */}
                    <TableCell className="py-3 max-[419px]:py-2 max-[419px]:px-2 font-medium">
                      {row.moneyline}
                    </TableCell>
                    {/* Edge cell with green/red styling */}
                    <TableCell className={`py-3 max-[419px]:py-2 max-[419px]:px-2 font-medium ${edgeColorClass(edgeVal)}`}>
                      {row.edge}
                    </TableCell>
                    {/* Kelly cell with green/red styling */}
                    <TableCell className={`py-3 max-[419px]:py-2 max-[419px]:px-2 font-medium ${kellyColorClass(kellyVal)}`}>
                      {row.kelly || "N/A"}
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

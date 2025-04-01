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
};

type SortColumn = 'book' | 'moneyline' | 'probability' | 'edge';
type SortDirection = 'asc' | 'desc';

const OddsTable = ({ oddsData }: OddsTableProps) => {
  const [sortedData, setSortedData] = useState<OddsRow[]>([]);
  const [sortColumn, setSortColumn] = useState<SortColumn>('edge');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    if (!oddsData) {
      setSortedData([]);
      return;
    }
    const dataToSort = [...oddsData];
    const sorted = dataToSort.sort((a, b) => {
      let valueA, valueB;
      switch (sortColumn) {
        case 'book':
          valueA = a.book.toLowerCase();
          valueB = b.book.toLowerCase();
          return sortDirection === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        case 'moneyline':
          valueA = parseInt(a.moneyline.replace(/[+\-]/g, ''));
          valueB = parseInt(b.moneyline.replace(/[+\-]/g, ''));
          if (a.moneyline.startsWith('-') && !b.moneyline.startsWith('-')) {
            return sortDirection === 'asc' ? -1 : 1;
          } 
          if (!a.moneyline.startsWith('-') && b.moneyline.startsWith('-')) {
            return sortDirection === 'asc' ? 1 : -1;
          }
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        case 'probability':
          valueA = parseFloat(a.probability.replace('%', ''));
          valueB = parseFloat(b.probability.replace('%', ''));
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        case 'edge':
          valueA = parseFloat(a.edge);
          valueB = parseFloat(b.edge);
          return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;   
        default:
          return 0;
      }
    });
    
    setSortedData(sorted);
  }, [oddsData, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection(column === 'edge' || column === 'probability' ? 'desc' : 'asc');
    }
  };
  
  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' 
      ? <ChevronUp className="inline h-4 w-4 ml-1" /> 
      : <ChevronDown className="inline h-4 w-4 ml-1" />;
  };

  return (
    <div className="mt-6 overflow-hidden border border-border rounded-lg bg-card">
      <div className="relative min-h-[280px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent hover:scrollbar-thumb-muted/80">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50 pointer-events-none"></div>
          <Table className="w-full text-sm">
            <TableHeader className="sticky top-0 z-10 bg-gradient-to-r from-background to-primary/5">
              <TableRow className="border-b border-border bg-card hover:bg-card">
                <TableHead 
                  className="w-1/4 font-medium text-foreground cursor-pointer"
                  style={{minWidth: '100px'}}
                  onClick={() => handleSort('book')}
                >
                  Casino {renderSortIcon('book')}
                </TableHead>
                <TableHead 
                  className="w-1/4 font-medium text-foreground cursor-pointer"
                  style={{minWidth: '100px'}}
                  onClick={() => handleSort('moneyline')}
                >
                  Moneyline {renderSortIcon('moneyline')}
                </TableHead>
                <TableHead 
                  className="w-1/4 font-medium text-foreground cursor-pointer"
                  style={{minWidth: '120px'}}
                  onClick={() => handleSort('probability')}
                >
                  Win Probability {renderSortIcon('probability')}
                </TableHead>
                <TableHead 
                  className="w-1/4 font-medium text-foreground cursor-pointer"
                  style={{minWidth: '80px'}}
                  onClick={() => handleSort('edge')}
                >
                  Edge {renderSortIcon('edge')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData && sortedData.length > 0 ? (
                sortedData.map((row, idx) => {
                  const edgeValue = parseFloat(row.edge);
                  const edgeColorClass = edgeValue > 0 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : edgeValue < 0 
                      ? "text-rose-600 dark:text-rose-400" 
                      : "text-muted-foreground";
                  return (
                    <TableRow
                      key={idx}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-all duration-200"
                      style={{
                        animationDelay: `${idx * 50}ms`,
                        animationName: 'fadeIn',
                        animationDuration: '400ms',
                        animationFillMode: 'both',
                        opacity: 0, 
                        transform: 'translateY(0)'                  
                      }}
                    >
                      <TableCell className="py-3 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 flex items-center justify-center bg-card border border-border/50 rounded-md overflow-hidden shadow-sm flex-shrink-0">
                            <img 
                              src={getCasinoLogo(row.book)} 
                              alt={`${row.book} logo`}
                              className="max-w-full max-h-full object-contain p-1" 
                              onError={(e) => {
                                e.currentTarget.src = "/images/casinos/generic-casino.svg";
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium">{row.book}</span>
                        </div>
                      </TableCell>                 
                      <TableCell className="py-3 font-medium">{row.moneyline}</TableCell>
                      <TableCell className="py-3 font-medium">{row.probability}</TableCell>
                      <TableCell className={`py-3 font-medium ${edgeColorClass}`}>
                        <div className="flex items-center">
                          {edgeValue > 0 ? (
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/30 mr-2">
                              <span className="text-emerald-500 dark:text-emerald-400 text-xs">↑</span>
                            </div>
                          ) : edgeValue < 0 ? (
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/30 mr-2">
                              <span className="text-rose-500 dark:text-rose-400 text-xs">↓</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted/30 mr-2">
                              <span className="text-muted-foreground text-xs">–</span>
                            </div>
                          )}
                          <span>{row.edge}</span>
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
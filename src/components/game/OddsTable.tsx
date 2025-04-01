"use client";

import React from "react";
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

type OddsTableProps = {
  oddsData: OddsRow[];
};

const OddsTable = ({ oddsData }: OddsTableProps) => {
  return (
    <div className="mt-6 overflow-hidden border border-border rounded-lg bg-card">
      <div className="relative min-h-[280px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent hover:scrollbar-thumb-muted/80">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50 pointer-events-none"></div>
          <Table className="w-full text-sm">
            <TableHeader className="sticky top-0 z-10 bg-gradient-to-r from-background to-primary/5">
              <TableRow className="border-b border-border bg-card hover:bg-card">
                <TableHead className="w-1/4 font-medium text-foreground" style={{minWidth: '100px'}}>Casino</TableHead>
                <TableHead className="w-1/4 font-medium text-foreground" style={{minWidth: '100px'}}>Moneyline</TableHead>
                <TableHead className="w-1/4 font-medium text-foreground" style={{minWidth: '120px'}}>Win Probability</TableHead>
                <TableHead className="w-1/4 font-medium text-foreground" style={{minWidth: '80px'}}>Edge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {oddsData && oddsData.length > 0 ? (
                oddsData.map((row, idx) => {
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
                        <div className="flex items-center gap-2">
                          <div className="relative w-6 h-6 bg-white rounded-full overflow-hidden shadow-sm flex-shrink-0">
                            <img 
                              src={getCasinoLogo(row.book)} 
                              alt={`${row.book} logo`}
                              className="w-full h-full object-contain p-0.5" 
                            />
                          </div>
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
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Download, CheckCircle2, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ImpactData {
  costReduction: number; // percentage
  carbonReduction: number; // percentage
  flexValueEarned: number; // GBP per inference
  carbonCapMaintained: boolean;
  savings: {
    cost: { before: number; after: number };
    carbon: { before: number; after: number };
    flexCredits: { before: number; after: number };
  };
  auditLog: Array<{
    timestamp: string;
    action: string;
    reason: string;
    savings: string;
    dataSources: string[];
  }>;
  becknTransactions: Array<{
    step: string;
    status: "completed" | "pending";
    metadata: string;
    timestamp: string;
  }>;
}

interface ImpactSectionProps {
  data: ImpactData;
}

export default function ImpactSection({ data }: ImpactSectionProps) {
  const chartData = [
    {
      metric: "Cost",
      before: data.savings.cost.before,
      after: data.savings.cost.after,
    },
    {
      metric: "Carbon",
      before: data.savings.carbon.before,
      after: data.savings.carbon.after,
    },
    {
      metric: "Flex Credits",
      before: data.savings.flexCredits.before,
      after: data.savings.flexCredits.after,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Final KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600">-{data.costReduction}%</p>
              <p className="text-sm text-muted-foreground mt-1">Cost Reduction</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-600">-{data.carbonReduction}%</p>
              <p className="text-sm text-muted-foreground mt-1">Carbon Reduction</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-600">
                +£{data.flexValueEarned.toFixed(3)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Flex Value / inference</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    data.carbonCapMaintained
                      ? "bg-green-500/10"
                      : "bg-red-500/10"
                  }`}
                >
                  <CheckCircle2
                    className={`h-6 w-6 ${
                      data.carbonCapMaintained ? "text-green-600" : "text-red-600"
                    }`}
                  />
                </div>
              </div>
              <p
                className={`text-lg font-bold ${
                  data.carbonCapMaintained ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {data.carbonCapMaintained ? "Maintained" : "Exceeded"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Carbon Cap</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Savings Visualization */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium mb-4">Savings & Impact</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="metric" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="before" fill="#ef4444" name="Before" />
              <Bar dataKey="after" fill="#10b981" name="After" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audit Log */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Audit Log</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {data.auditLog.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs font-mono text-muted-foreground">
                        {entry.timestamp}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Decision #{index + 1}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mb-1">{entry.action}</p>
                  <p className="text-xs text-muted-foreground mb-2">{entry.reason}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-medium">{entry.savings}</span>
                    <span className="text-muted-foreground">
                      Sources: {entry.dataSources.join(", ")}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Beckn Transaction Timeline */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium mb-4">Beckn Transaction Timeline</h3>
            <div className="space-y-3">
              {data.becknTransactions.map((tx, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      tx.status === "completed"
                        ? "bg-green-500/10 text-green-600"
                        : "bg-yellow-500/10 text-yellow-600"
                    }`}
                  >
                    {tx.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{tx.step}</p>
                      <Badge
                        variant={tx.status === "completed" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{tx.metadata}</p>
                    <p className="text-xs text-muted-foreground mt-1">{tx.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


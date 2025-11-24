"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useDebate } from "@/components/council/use-debate";
import CouncilMember from "@/components/council/member";
import DebateLog from "@/components/council/log";
import Verdict from "@/components/council/verdict";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Rocket, StopCircle, Wand2, Volume2 } from "lucide-react";
import { toast } from "sonner";

export default function CouncilClient() {
  const D = useDebate();
  const activeTab = D.status === "complete" && D.decision ? "decision" : "debate";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold">AI Sustainability Council</h1>
          <p className="text-sm text-muted-foreground">
            Five specialized agents discuss your prompt and produce a consensus, action-ready plan.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={D.autoVoice ? "default" : "secondary"}
            onClick={() => D.setAutoVoice(!D.autoVoice)}
            title="Auto-speak new remarks"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            {D.autoVoice ? "Auto-voice: ON" : "Auto-voice: OFF"}
          </Button>

          {D.status !== "debating" ? (
            <Button onClick={() => { D.start(); toast.message("Debate started"); }}>
              <Rocket className="h-4 w-4 mr-2" /> Start Debate
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => { D.stop(); toast.error("Debate stopped"); }}>
              <StopCircle className="h-4 w-4 mr-2" /> Stop
            </Button>
          )}
          <Button variant="secondary" onClick={() => { D.reset(); toast.info("Reset"); }}>
            Reset
          </Button>
        </div>
      </div>

      {/* Prompt input */}
      <div className="rounded-xl border p-4 bg-background">
        <div className="text-xs text-muted-foreground mb-2">Council Prompt</div>
        <textarea
          value={D.prompt}
          onChange={(e) => D.setPrompt(e.target.value)}
          rows={3}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Describe your constraint, e.g., budget, fleet size, regulation, timeline…"
        />
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary">{D.status.toUpperCase()}</Badge>
          <span className="text-xs text-muted-foreground">Press “Start Debate” to see an animated discussion.</span>
        </div>
      </div>

      {/* Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {D.members.map((m) => (
          <CouncilMember
            key={m.id}
            name={m.role}
            role={m.role}
            emoji={m.emoji}
            color={m.color}
            speaking={D.speakingId === m.id}
          />
        ))}
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
        <TabsList className="mb-3">
          <TabsTrigger value="debate">Debate</TabsTrigger>
          <TabsTrigger
            value="decision"
            onClick={() => {
              if (!D.decision) {
                D.finalize();
                toast.success("Consensus synthesized");
              }
            }}
          >
            Decision
          </TabsTrigger>
        </TabsList>

        <TabsContent value="debate">
          <DebateLog rows={D.messages} />
          {D.status === "complete" && (
            <div className="mt-3 flex gap-2">
              <Button
                onClick={() => {
                  D.finalize();
                  toast.success("Consensus synthesized");
                }}
              >
                <Wand2 className="h-4 w-4 mr-2" /> Synthesize Decision
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="decision">
          {D.decision ? (
            <Verdict data={D.decision} />
          ) : (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">
              Run a debate first, then synthesize a decision.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

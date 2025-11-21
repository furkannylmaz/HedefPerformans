"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Squad {
  id: string;
  name: string;
  ageGroupCode: string;
  template: string;
  instance: string;
}

interface CreateMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  squads: Squad[];
  onCreate: (data: {
    squadId: string;
    date: string;
    opponentSquadId?: string | null;
    opponent?: string | null;
    playerIds?: string[];
  }) => void;
}

export function CreateMatchDialog({
  open,
  onOpenChange,
  squads,
  onCreate,
}: CreateMatchDialogProps) {
  const [selectedSquadId, setSelectedSquadId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [opponentSquadId, setOpponentSquadId] = useState<string>("");
  const [opponent, setOpponent] = useState<string>("");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [squadPlayers, setSquadPlayers] = useState<
    Array<{ id: string; name: string; number: number }>
  >([]);

  useEffect(() => {
    if (selectedSquadId) {
      loadSquadPlayers();
    } else {
      setSquadPlayers([]);
      setSelectedPlayerIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSquadId]);

  const loadSquadPlayers = async () => {
    try {
      const response = await fetch(`/api/squads`);
      const data = await response.json();
      if (data.success) {
        const squad = data.data.squads.find(
          (s: { id: string }) => s.id === selectedSquadId
        );
        if (squad && "slots" in squad) {
          const players = (
            squad.slots as Array<{
              assignment?: {
                user: { id: string; firstName: string; lastName: string };
              };
              number: number;
            }>
          )
            .filter(
              (
                slot
              ): slot is {
                assignment: {
                  user: { id: string; firstName: string; lastName: string };
                };
                number: number;
              } => !!slot.assignment
            )
            .map((slot) => ({
              id: slot.assignment.user.id,
              name: `${slot.assignment.user.firstName} ${slot.assignment.user.lastName}`,
              number: slot.number,
            }));
          setSquadPlayers(players);
        }
      }
    } catch (error) {
      console.error("Squad players load error:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSquadId || !date) {
      return;
    }
    onCreate({
      squadId: selectedSquadId,
      date,
      opponentSquadId:
        opponentSquadId && opponentSquadId !== "manual"
          ? opponentSquadId
          : null,
      opponent: opponent || null,
      playerIds: selectedPlayerIds,
    });
    // Reset form
    setSelectedSquadId("");
    setDate("");
    setOpponentSquadId("");
    setOpponent("");
    setSelectedPlayerIds([]);
  };

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Maç Başlat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="squad">Takım Seç</Label>
              <Select
                value={selectedSquadId}
                onValueChange={setSelectedSquadId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Takım seçin" />
                </SelectTrigger>
                <SelectContent>
                  {squads.map((squad) => (
                    <SelectItem key={squad.id} value={squad.id}>
                      {squad.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tarih</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="opponentSquad">Rakip Takım (Sistemden Seç)</Label>
              <Select
                value={opponentSquadId}
                onValueChange={setOpponentSquadId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rakip takım seçin (opsiyonel)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manuel giriş</SelectItem>
                  {squads
                    .filter((s) => s.id !== selectedSquadId)
                    .map((squad) => (
                      <SelectItem key={squad.id} value={squad.id}>
                        {squad.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {(!opponentSquadId || opponentSquadId === "manual") && (
              <div className="space-y-2">
                <Label htmlFor="opponent">Rakip Takım Adı (Manuel)</Label>
                <Input
                  id="opponent"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  placeholder="Rakip takım adı"
                />
              </div>
            )}

            {selectedSquadId && squadPlayers.length > 0 && (
              <div className="space-y-2">
                <Label>Maçta Oynayan Oyuncular</Label>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {squadPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`player-${player.id}`}
                          checked={selectedPlayerIds.includes(player.id)}
                          onCheckedChange={() => togglePlayer(player.id)}
                        />
                        <label
                          htmlFor={`player-${player.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {player.number} - {player.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              Maçı Oluştur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

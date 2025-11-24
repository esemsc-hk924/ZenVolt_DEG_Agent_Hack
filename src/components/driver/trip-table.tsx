import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TripTable({
  rows,
}: {
  rows: {
    tripId: string;
    l_per_100km: number;
    idle_minutes: number;
    overspeed: number;
    harsh_accel: number;
    harsh_brake: number;
    cornering: number;
  }[];
}) {
  return (
    <Card className="border">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trip</TableHead>
              <TableHead>Fuel Intensity (L/100km)</TableHead>
              <TableHead>Idle (min)</TableHead>
              <TableHead>Overspeed</TableHead>
              <TableHead>Harsh accel</TableHead>
              <TableHead>Harsh brake</TableHead>
              <TableHead>Cornering</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.tripId}>
                <TableCell className="font-medium">{r.tripId}</TableCell>
                <TableCell>{r.l_per_100km.toFixed(1)}</TableCell>
                <TableCell>{r.idle_minutes}</TableCell>
                <TableCell>{r.overspeed}</TableCell>
                <TableCell>{r.harsh_accel}</TableCell>
                <TableCell>{r.harsh_brake}</TableCell>
                <TableCell>{r.cornering}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function ClientSetpointForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [setpoint, setSetpoint] = useState(30);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.set("setpoint", setpoint.toString());
      await action(formData);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="setpoint">Setpoint</Label>
        <Input
          id="setpoint"
          type="number"
          value={setpoint}
          onChange={(e) => setSetpoint(Number(e.target.value))}
        />
      </div>
      <Button disabled={isPending} type="submit">
        {isPending ? "Loading..." : "Submit"}
      </Button>
    </form>
  );
}

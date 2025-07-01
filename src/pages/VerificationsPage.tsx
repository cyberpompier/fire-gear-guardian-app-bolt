import React, { useState } from "react";
import { VerificationCalendar } from "@/components/verifications/VerificationCalendar";
import { CompleteVerificationForm } from "@/components/forms/CompleteVerificationForm";
import { Dialog } from "@/components/ui/dialog";
import type { Verification } from "@/hooks/useVerifications";

export function VerificationsPage() {
  const [isCompleteVerificationModalOpen, setIsCompleteVerificationModalOpen] = useState(false);
  const [selectedVerificationToComplete, setSelectedVerificationToComplete] = useState<Verification | null>(null);

  const handleCompleteVerification = (verification: Verification) => {
    setSelectedVerificationToComplete(verification);
    setIsCompleteVerificationModalOpen(true);
  };

  const handleCompleteVerificationSubmit = () => {
    setIsCompleteVerificationModalOpen(false);
    setSelectedVerificationToComplete(null);
    // The useVerifications hook already handles invalidating queries and showing toast
  };

  const handleCompleteVerificationCancel = () => {
    setIsCompleteVerificationModalOpen(false);
    setSelectedVerificationToComplete(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vérifications EPI</h1>
        <p className="text-muted-foreground">
          Planification et suivi des vérifications d'équipements
        </p>
      </div>

      <VerificationCalendar onCompleteVerification={handleCompleteVerification} />

      {selectedVerificationToComplete && (
        <Dialog open={isCompleteVerificationModalOpen} onOpenChange={setIsCompleteVerificationModalOpen}>
          <CompleteVerificationForm
            verification={selectedVerificationToComplete}
            onSubmit={handleCompleteVerificationSubmit}
            onCancel={handleCompleteVerificationCancel}
          />
        </Dialog>
      )}
    </div>
  );
}

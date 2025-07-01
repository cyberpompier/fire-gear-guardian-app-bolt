import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVerifications } from "@/hooks/useVerifications";
import { usePersonnel } from "@/hooks/usePersonnel";
import { useEquipment } from "@/hooks/useEquipment";

interface ScheduleVerificationFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function ScheduleVerificationForm({ onSubmit, onCancel }: ScheduleVerificationFormProps) {
  const { scheduleVerification, isScheduling } = useVerifications();
  const { personnel, isLoading: isLoadingPersonnel } = usePersonnel();
  const { equipment: equipmentItems, isLoading: isLoadingEquipment } = useEquipment();

  const [formData, setFormData] = useState({
    equipmentItemId: "",
    verificationType: "Contrôle de conformité",
    scheduledDate: new Date(),
    assignedTo: "",
    priority: "Normale",
    notes: ""
  });

  const verificationTypes = [
    { value: "Contrôle de conformité", label: "Contrôle de conformité" },
    { value: "Vérification périodique", label: "Vérification périodique" },
    { value: "Maintenance préventive", label: "Maintenance préventive" },
    { value: "Réparation", label: "Réparation" }
  ];

  const priorities = [
    { value: "Basse", label: "Basse" },
    { value: "Normale", label: "Normale" },
    { value: "Haute", label: "Haute" },
    { value: "Urgent", label: "Urgent" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.equipmentItemId || !formData.assignedTo || !formData.scheduledDate) {
      // Optionally, show a local error message to the user
      return;
    }

    console.log("Submitting form data:", formData); // Log data before submission

    try {
      await scheduleVerification({
        equipmentItemId: formData.equipmentItemId,
        verificationType: formData.verificationType,
        scheduledDate: formData.scheduledDate.toISOString(),
        assignedTo: formData.assignedTo,
        priority: formData.priority,
        notes: formData.notes,
      });
      onSubmit(formData);
    } catch (error) {
      console.error("Error scheduling verification:", error);
      // The useVerifications hook should handle the toast notification for errors.
      // If you need more specific error display here, you would add state for it.
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-600" />
          Planifier une vérification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentItemId">EPI à vérifier *</Label>
              <Select
                value={formData.equipmentItemId}
                onValueChange={(value) => setFormData({ ...formData, equipmentItemId: value })}
                required
                disabled={isLoadingEquipment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un EPI" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingEquipment ? (
                    <SelectItem value="loading" disabled>Chargement des EPI...</SelectItem>
                  ) : (
                    equipmentItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.serialNumber} - {item.type}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationType">Type de vérification *</Label>
              <Select
                value={formData.verificationType}
                onValueChange={(value) => setFormData({ ...formData, verificationType: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {verificationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Date prévue *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduledDate ? format(formData.scheduledDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.scheduledDate}
                    onSelect={(date) => date && setFormData({ ...formData, scheduledDate: date })}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigné à *</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                required
                disabled={isLoadingPersonnel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une personne" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingPersonnel ? (
                    <SelectItem value="loading" disabled>Chargement du personnel...</SelectItem>
                  ) : (
                    personnel.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.firstName} {person.lastName} ({person.grade})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la priorité" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informations complémentaires..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isScheduling}>
              Annuler
            </Button>
            <Button type="submit" className="rescue-gradient text-white" disabled={isScheduling || !formData.equipmentItemId || !formData.assignedTo || !formData.scheduledDate}>
              {isScheduling ? "Planification..." : "Planifier la vérification"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

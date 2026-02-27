import ComponentCustomBulletedTextarea from "@/components/custom-input/textarea-bullet";

export function PurchaseRequestEditOtherDetails() {
  return (
    <>
      <div className="border rounded-xl shadow">
        <div className="p-4 border-b">
          <div>
            <h3 className="font-medium">Other Details</h3>
            <p className="text-xs text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam,
              consequatur?
            </p>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <ComponentCustomBulletedTextarea
            label="Notes"
            path="notes"
            placeholder="Type your features here, one per line..."
            bulletStyle="bullet"
          />
          <ComponentCustomBulletedTextarea
            label="Inclusions"
            path="inclusions"
            placeholder="Type your features here, one per line..."
            bulletStyle="bullet"
          />
          <ComponentCustomBulletedTextarea
            label="Room Accommodations"
            path="roomAccommodations"
            placeholder="Type your features here, one per line..."
            bulletStyle="bullet"
          />
          <ComponentCustomBulletedTextarea
            label="Function Rooms"
            path="functionRooms"
            placeholder="Type your features here, one per line..."
            bulletStyle="bullet"
          />
          <ComponentCustomBulletedTextarea
            label="Additional Requirements"
            path="additionalRequirements"
            placeholder="Type your features here, one per line..."
            bulletStyle="bullet"
          />
        </div>
      </div>
    </>
  );
}

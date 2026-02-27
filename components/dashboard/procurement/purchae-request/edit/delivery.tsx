import ComponentCustomDatePicker from "@/components/custom-input/datepicker";
import ComponentCustomInput from "@/components/custom-input/input";
import ComponentCustomTextarea from "@/components/custom-input/textarea";
import ComponentCustomTimePicker from "@/components/custom-input/timerange-picker";

export function PurchaseRequestEditDeliveryDetails() {
  return (
    <>
      <div className="border rounded-xl shadow">
        <div className="p-4 border-b">
          <div>
            <h3 className="font-medium">Delivery Details</h3>
            <p className="text-xs text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam,
              consequatur?
            </p>
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <ComponentCustomInput
              label="Location"
              path="delivery.location"
              placeholder="Enter location"
              required
            />
          </div>

          <ComponentCustomDatePicker
            path="delivery.date"
            label="Select Date"
            minDatePath="draftDate"
            maxDatePath="activity.schedule.dateStart"
            dateFormat="dd MMMM yyyy"
            storeAsTimestamp
            required
          />

          <ComponentCustomTimePicker
            variant="single"
            path="delivery.time"
            label="Start Time"
            storeAsTimestamp
            required
          />

          <div className="col-span-2">
            <ComponentCustomTextarea
              path="delivery.additionalInstruction"
              label="Additional Instruction"
              placeholder="Enter additional instruction"
              required
            />
          </div>
        </div>
      </div>
    </>
  );
}

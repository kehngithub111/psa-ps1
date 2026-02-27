import ComponentCustomDatePickerWithRange from "@/components/custom-input/daterange-picker";
import ComponentCustomTextarea from "@/components/custom-input/textarea";
import ComponentCustomTimePickerWithRange from "@/components/custom-input/timerange-picker";

export function PurchaseRequestEditActivityDetails() {
  return (
    <>
      <div className="border rounded-xl shadow">
        <div className="p-4 border-b">
          <div>
            <h3 className="font-medium">Activity Details</h3>
            <p className="text-xs text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam,
              consequatur?
            </p>
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <ComponentCustomTextarea
              path="activity.title"
              label="Title"
              placeholder="Enter the title of this activity"
              required
            />
          </div>

          <ComponentCustomDatePickerWithRange
            startPath="activity.schedule.dateStart"
            endPath="activity.schedule.dateEnd"
            label="Date Start - End"
            dateFormat="dd MMMM yyyy"
            minDatePath="draftDate"
            storeAsTimestamp
            required
          />

          <ComponentCustomTimePickerWithRange
            variant="range"
            startPath="activity.schedule.timeStart"
            endPath="activity.schedule.timeEnd"
            label="Time Start - End"
            storeAsTimestamp
            required
          />

          <div className="col-span-2">
            <ComponentCustomTextarea
              path="activity.purpose"
              label="Purpose"
              placeholder="Enter the purpose of this activity"
              required
            />
          </div>
        </div>
      </div>
    </>
  );
}

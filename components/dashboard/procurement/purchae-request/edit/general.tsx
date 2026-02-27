import ComponentCustomInput from "@/components/custom-input/input";
import ComponentCustomSelect from "@/components/custom-input/select";

export function PurchaseRequestEditGeneralInformation() {
  return (
    <>
      <div className="border rounded-xl shadow">
        <div className="p-4 border-b">
          <div>
            <h3 className="font-medium">General Information</h3>
            <p className="text-xs text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam,
              consequatur?
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <ComponentCustomSelect
            label="Procurement Mode"
            path="procurementMode"
            placeholder="Select a procurement mode"
            required
            searchable
            options={[
              { value: "small_value", label: "Small Value" },
              { value: "small_value_lot", label: "Small Value Lot" },
              { value: "small_value_inlot", label: "Small Value inLot" },
              { value: "lease_venue_inlot", label: "Lease Venue inLot" },
              { value: "lease_venue_lot", label: "Lease Venue Lot" },
            ]}
          />

          <ComponentCustomSelect
            label="Priority Level"
            path="priorityLevel"
            placeholder="Select a priorityLevel"
            required
            options={[
              { value: "low", label: "Low" },
              { value: "normal", label: "Normal" },
              { value: "urgent", label: "Urgent" },
            ]}
          />

          <ComponentCustomSelect
            label="Office Section"
            path="officeSection"
            placeholder="Select a office section"
            required
            options={[
              { value: "socd", label: "SOCD" },
              { value: "crasd", label: "CRASD" },
              { value: "ord", label: "ORD" },
            ]}
          />

          <ComponentCustomInput
            label="Fund Cluster"
            path="fundCluster"
            placeholder="Enter fund cluster"
            required
            disabled
            disabledReason="This field is disabled because it is a generated value"
          />

          <ComponentCustomInput
            label="Responsibility Center Code"
            path="rcc"
            placeholder="Enter Responsibility Center Code"
            required
          />

          <ComponentCustomSelect
            label="Charged To"
            path="chargedTo"
            placeholder="Select a charged to"
            required
            options={[
              { value: "low", label: "Low" },
              { value: "normal", label: "Normal" },
              { value: "urgent", label: "Urgent" },
            ]}
          />

          <ComponentCustomSelect
            label="PAP Code"
            path="papCode"
            placeholder="Select a pap code"
            required
            options={[
              { value: "low", label: "Low" },
              { value: "normal", label: "Normal" },
              { value: "urgent", label: "Urgent" },
            ]}
          />
        </div>
      </div>
    </>
  );
}
